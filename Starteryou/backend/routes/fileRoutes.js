const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const FileMetadata = require("../models/FileMetadata");
require("dotenv").config();
const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const router = express.Router();

// Initialize GridFSBucket
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

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "File Upload API",
      version: "1.0.0",
      description:
        "API for file upload, download, update, and delete operations using GridFS",
    },
    servers: [
      {
        url: `${backendUrl}:3000/api/`,
      },
    ],
  },
  apis: ["./routes/fileRoutes.js"], // Path to this file
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Swagger UI setup
router.use("/api-test", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /upload:
 *   post:
 *     tags:
 *       - FileRoutes
 *     summary: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               uploadedBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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

    const existingFile = await FileMetadata.findOne({ title: req.body.title });
    if (existingFile) {
      return res
        .status(400)
        .json({ success: false, message: "File title already exists" });
    }

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

/**
 * @swagger
 * /update/{title}:
 *   put:
 *     tags:
 *       - FileRoutes
 *     summary: Update a file
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the file to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /download/{title}:
 *   get:
 *     tags:
 *       - FileRoutes
 *     summary: Download a file
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the file to download
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /delete/{title}:
 *   delete:
 *     tags:
 *       - FileRoutes
 *     summary: Delete a file
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */

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
