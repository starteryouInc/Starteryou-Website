// fileRoutes.js
const express = require("express");
const multer = require("multer");
const {GridFSBucket, ObjectId} = require("mongodb");
const mongoose = require("mongoose");
const FileMetadata = require("../models/FileMetadata");
require("dotenv").config();

const router = express.Router();
const mongoURI = process.env.MONGODB_URI;

// Connection and bucket setup
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let bucket;

conn.once("open", () => {
  console.log("GridFS Connection opened successfully");
  try {
    bucket = new GridFSBucket(conn.db, {bucketName: "uploads"});
    console.log("GridFS Bucket 'uploads' initialized successfully");
  } catch (error) {
    console.error("Error creating GridFS bucket:", error);
  }
});

conn.on("error", (err) => {
  console.error("GridFS Connection error:", err);
});

// Memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({storage});

// File upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!bucket) {
    return res
      .status(500)
      .json({message: "File storage system not initialized"});
  }

  if (!req.file) {
    return res.status(400).json({message: "No file uploaded"});
  }

  const {buffer, originalname} = req.file;
  const {title, uploadedBy} = req.body;

  if (!uploadedBy) {
    return res
      .status(400)
      .json({message: 'The "uploadedBy" field is required'});
  }

  if (!title) {
    return res.status(400).json({message: 'The "title" field is required'});
  }

  try {
    const uploadStream = bucket.openUploadStream(originalname);
    uploadStream.on("finish", async (file) => {
      try {
        const fileMetadata = new FileMetadata({
          title,
          originalFilename: originalname,
          uploadedBy,
          gridFsFileId: file._id,
        });
        await fileMetadata.save();
        res.status(201).json({
          file: {
            _id: file._id,
            filename: originalname,
            title,
          },
        });
      } catch (error) {
        console.error("Error saving metadata:", error);
        res.status(500).json({message: "Error saving file metadata"});
      }
    });

    uploadStream.on("error", (error) => {
      console.error("Error during upload:", error);
      res.status(500).json({message: error.message});
    });

    uploadStream.end(buffer);
  } catch (error) {
    console.error("Error initializing upload:", error);
    res.status(500).json({message: "Error initializing file upload"});
  }
});

// File retrieval route
router.get("/title/:title", async (req, res) => {
  if (!bucket) {
    return res
      .status(500)
      .json({message: "File storage system not initialized"});
  }

  const {title} = req.params;

  try {
    const metadata = await FileMetadata.findOne({title});
    if (!metadata) {
      console.log(`Metadata not found for title: ${title}`);
      return res.status(404).json({message: "File metadata not found"});
    }

    console.log(
      `Metadata found for title: ${title}, GridFS ID: ${metadata.gridFsFileId}`
    );

    if (!ObjectId.isValid(metadata.gridFsFileId)) {
      console.log(`Invalid GridFS ID: ${metadata.gridFsFileId}`);
      await FileMetadata.deleteOne({_id: metadata._id});
      return res.status(404).json({message: "Invalid file reference"});
    }

    // Check if the file exists in GridFS
    const file = await bucket
      .find({_id: new ObjectId(metadata.gridFsFileId)})
      .toArray();
    if (file.length === 0) {
      console.log(`File not found in GridFS for ID: ${metadata.gridFsFileId}`);
      await FileMetadata.deleteOne({_id: metadata._id});
      return res.status(404).json({message: "File not found in GridFS"});
    }

    console.log(`Opening download stream for file: ${metadata.gridFsFileId}`);
    const readStream = bucket.openDownloadStream(
      new ObjectId(metadata.gridFsFileId)
    );

    readStream.on("error", async (error) => {
      console.error(
        `Error reading file stream for ${metadata.gridFsFileId}:`,
        error
      );
      if (error.code === "ENOENT" || error.message.includes("FileNotFound")) {
        console.log(
          `Deleting metadata for missing file: ${metadata.gridFsFileId}`
        );
        await FileMetadata.deleteOne({_id: metadata._id});
        return res.status(404).json({message: "File not found in GridFS"});
      }
      res.status(500).json({message: "Error retrieving file"});
    });

    res.set("Content-Type", "application/octet-stream");
    res.set(
      `Content-Disposition`,
      `attachment; filename="${metadata.originalFilename}"`
    );
    readStream.pipe(res);
  } catch (error) {
    console.error("Error fetching file by title:", error);
    res.status(500).json({message: error.message});
  }
});

// List all files route
router.get("/list", async (req, res) => {
  try {
    const files = await FileMetadata.find().lean();
    const filesWithGridFSCheck = await Promise.all(
      files.map(async (file) => {
        const exists = await bucket
          .find({_id: new ObjectId(file.gridFsFileId)})
          .hasNext();
        return {...file, existsInGridFS: exists};
      })
    );
    res.json(filesWithGridFSCheck);
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({message: "Error listing files"});
  }
});

// Update file route
router.put("/update", upload.single("file"), async (req, res) => {
  console.log("Update route called");
  if (!bucket) {
    console.log("Bucket not initialized");
    return res
      .status(500)
      .json({message: "File storage system not initialized"});
  }

  const {id, title, uploadedBy} = req.body;
  console.log("Request body:", {id, title, uploadedBy});

  if (!id) {
    console.log("File ID missing");
    return res.status(400).json({message: "File ID is required"});
  }

  try {
    console.log("Finding existing file");
    const existingFile = await FileMetadata.findById(id);

    if (!existingFile) {
      console.log("File not found");
      return res.status(404).json({message: "File not found"});
    }

    console.log("Existing file found:", existingFile);

    // Update metadata
    if (title) existingFile.title = title;
    if (uploadedBy) existingFile.uploadedBy = uploadedBy;

    // If a new file is uploaded, replace the old one
    if (req.file) {
      console.log("New file uploaded, replacing old one");
      const {buffer, originalname} = req.file;

      // Delete old file from GridFS
      console.log("Deleting old file from GridFS");
      await bucket.delete(new ObjectId(existingFile.gridFsFileId));

      // Upload new file
      console.log("Uploading new file");
      const uploadStream = bucket.openUploadStream(originalname);
      uploadStream.end(buffer);

      await new Promise((resolve, reject) => {
        uploadStream.on("finish", async (file) => {
          console.log("New file upload finished");
          existingFile.originalFilename = originalname;
          existingFile.gridFsFileId = file._id;
          resolve();
        });
        uploadStream.on("error", (error) => {
          console.error("Error during file upload:", error);
          reject(error);
        });
      });
    }

    console.log("Saving updated file metadata");
    await existingFile.save();

    console.log("File update successful");
    res.status(200).json({
      message: "File updated successfully",
      file: {
        _id: existingFile._id,
        filename: existingFile.originalFilename,
        title: existingFile.title,
      },
    });
  } catch (error) {
    console.error("Error updating file:", error);
    res
      .status(500)
      .json({message: "Error updating file", error: error.message});
  }
});

// Delete file route
router.delete("/:id", async (req, res) => {
  if (!bucket) {
    return res
      .status(500)
      .json({message: "File storage system not initialized"});
  }

  const {id} = req.params;

  try {
    const fileMetadata = await FileMetadata.findById(id);
    if (!fileMetadata) {
      console.log(`File metadata not found for ID: ${id}`);
      return res.status(404).json({message: "File metadata not found"});
    }

    console.log(`Deleting file metadata for ID: ${id}`);
    await FileMetadata.deleteOne({_id: id});

    if (ObjectId.isValid(fileMetadata.gridFsFileId)) {
      console.log(
        `Deleting file from GridFS for ID: ${fileMetadata.gridFsFileId}`
      );
      await bucket.delete(new ObjectId(fileMetadata.gridFsFileId));
    }

    res.status(200).json({message: "File deleted successfully"});
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({message: "Error deleting file"});
  }
});

module.exports = router;
