// routes/verificationRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const FileMetadata = require("../models/FileMetadata");

// GET: Verify specific file
router.get("/verify/:title", async (req, res) => {
  try {
    // Find metadata
    const metadata = await FileMetadata.findOne({ title: req.params.title });
    if (!metadata) {
      return res.status(404).json({
        success: false,
        message: "File metadata not found",
      });
    }

    // Check GridFS file
    const gridFsFile = await mongoose.connection.db
      .collection("uploads.files")
      .findOne({ _id: new ObjectId(metadata.gridFsFileId) });

    // Get chunks info
    const chunksCount = await mongoose.connection.db
      .collection("uploads.chunks")
      .countDocuments({ files_id: new ObjectId(metadata.gridFsFileId) });

    const fileStatus = {
      title: metadata.title,
      metadata: {
        exists: true,
        id: metadata._id,
        gridFsFileId: metadata.gridFsFileId,
        createdAt: metadata.createdAt,
      },
      gridfs: {
        exists: !!gridFsFile,
        size: gridFsFile ? gridFsFile.length : 0,
        chunkCount: chunksCount,
        contentType: gridFsFile ? gridFsFile.contentType : null,
      },
    };

    res.json({
      success: true,
      file: fileStatus,
      isHealthy: !!(gridFsFile && chunksCount > 0),
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error during verification",
      error: error.message,
    });
  }
});

// GET: Verify all files
router.get("/verify-all", async (req, res) => {
  try {
    const files = await FileMetadata.find({});
    const verificationResults = [];
    let healthyFiles = 0;
    let problematicFiles = 0;

    for (const file of files) {
      const gridFsFile = await mongoose.connection.db
        .collection("uploads.files")
        .findOne({ _id: new ObjectId(file.gridFsFileId) });

      const chunksCount = await mongoose.connection.db
        .collection("uploads.chunks")
        .countDocuments({ files_id: new ObjectId(file.gridFsFileId) });

      const isHealthy = !!(gridFsFile && chunksCount > 0);

      if (isHealthy) {
        healthyFiles++;
      } else {
        problematicFiles++;
      }

      verificationResults.push({
        title: file.title,
        isHealthy,
        details: {
          hasMetadata: true,
          hasGridFsFile: !!gridFsFile,
          hasChunks: chunksCount > 0,
          chunksCount,
          size: gridFsFile ? gridFsFile.length : 0,
        },
      });
    }

    res.json({
      success: true,
      summary: {
        totalFiles: files.length,
        healthyFiles,
        problematicFiles,
      },
      results: verificationResults,
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error during verification",
      error: error.message,
    });
  }
});

// POST: Repair file
router.post("/repair/:title", async (req, res) => {
  try {
    const metadata = await FileMetadata.findOne({ title: req.params.title });
    if (!metadata) {
      return res.status(404).json({
        success: false,
        message: "File metadata not found",
      });
    }

    const gridFsFile = await mongoose.connection.db
      .collection("uploads.files")
      .findOne({ _id: new ObjectId(metadata.gridFsFileId) });

    if (!gridFsFile) {
      // Clean up orphaned metadata
      await FileMetadata.deleteOne({ _id: metadata._id });
      return res.json({
        success: true,
        message: "Cleaned up orphaned metadata",
        action: "deleted_metadata",
      });
    }

    // Update metadata with missing information
    const updates = {};
    if (!metadata.contentType) {
      updates.contentType =
        gridFsFile.contentType || "application/octet-stream";
    }
    if (!metadata.size) {
      updates.size = gridFsFile.length || 0;
    }

    if (Object.keys(updates).length > 0) {
      await FileMetadata.updateOne({ _id: metadata._id }, { $set: updates });
    }

    res.json({
      success: true,
      message: "File repaired",
      updates,
    });
  } catch (error) {
    console.error("Repair error:", error);
    res.status(500).json({
      success: false,
      message: "Error during repair",
      error: error.message,
    });
  }
});

module.exports = router;
