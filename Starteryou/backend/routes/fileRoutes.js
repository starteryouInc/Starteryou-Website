const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const FileMetadata = require("../models/FileMetadata");
require("dotenv").config();

const router = express.Router();

// Initialize GridFSBucket.
let bucket;
mongoose.connection.once("open", () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
  console.log("✅ GridFS bucket initialized");
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Helper function to ensure GridFSBucket is initialized
const ensureBucket = () => {
  if (!bucket) {
    throw new Error("GridFSBucket not initialized. MongoDB connection failed.");
  }
  return bucket;
};

// POST: Upload a file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    if (!req.body.title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const gridFsBucket = ensureBucket();

    // Check for duplicate title
    const existingFile = await FileMetadata.findOne({ title: req.body.title });
    if (existingFile) {
      return res
        .status(400)
        .json({ success: false, message: "File title already exists" });
    }

    // Upload to GridFS
    const uploadStream = gridFsBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: {
        title: req.body.title,
        uploadedBy: req.body.uploadedBy || "unknown",
      },
    });

    uploadStream.end(req.file.buffer, async (err) => {
      if (err) throw err;

      const fileMetadata = new FileMetadata({
        title: req.body.title,
        originalFilename: req.file.originalname,
        uploadedBy: req.body.uploadedBy || "unknown",
        contentType: req.file.mimetype,
        size: req.file.size,
        gridFsFileId: uploadStream.id,
      });

      await fileMetadata.save();
      res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        metadata: fileMetadata,
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
});

// PUT: Update a file
router.put("/update/:title", upload.single("file"), async (req, res) => {
  try {
    const gridFsBucket = ensureBucket();

    const fileMetadata = await FileMetadata.findOne({
      title: req.params.title,
    });
    if (!fileMetadata) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    if (req.file) {
      // Delete old file
      await gridFsBucket.delete(new ObjectId(fileMetadata.gridFsFileId));

      // Upload new file
      const uploadStream = gridFsBucket.openUploadStream(
        req.file.originalname,
        {
          contentType: req.file.mimetype,
        }
      );

      uploadStream.end(req.file.buffer, async (err) => {
        if (err) throw err;

        fileMetadata.gridFsFileId = uploadStream.id;
        fileMetadata.originalFilename = req.file.originalname;
        fileMetadata.contentType = req.file.mimetype;
        fileMetadata.size = req.file.size;

        await fileMetadata.save();
        res.json({
          success: true,
          message: "File updated successfully",
          metadata: fileMetadata,
        });
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "No file provided for update" });
    }
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating file",
      error: error.message,
    });
  }
});

// GET: Download a file
router.get("/download/:title", async (req, res) => {
  try {
    const gridFsBucket = ensureBucket();

    const fileMetadata = await FileMetadata.findOne({
      title: req.params.title,
    });
    if (!fileMetadata) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    res.set({
      "Content-Type": fileMetadata.contentType,
      "Content-Disposition": `attachment; filename="${fileMetadata.originalFilename}"`,
    });

    const downloadStream = gridFsBucket.openDownloadStream(
      new ObjectId(fileMetadata.gridFsFileId)
    );
    downloadStream.pipe(res).on("error", (err) => {
      console.error("Download error:", err);
      res
        .status(500)
        .json({ success: false, message: "Error downloading file" });
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      success: false,
      message: "Error downloading file",
      error: error.message,
    });
  }
});

// DELETE: Remove a file
router.delete("/delete/:title", async (req, res) => {
  try {
    const gridFsBucket = ensureBucket();

    const fileMetadata = await FileMetadata.findOne({
      title: req.params.title,
    });
    if (!fileMetadata) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    await gridFsBucket.delete(new ObjectId(fileMetadata.gridFsFileId));
    await FileMetadata.deleteOne({ _id: fileMetadata._id });

    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error.message,
    });
  }
});

module.exports = router;
