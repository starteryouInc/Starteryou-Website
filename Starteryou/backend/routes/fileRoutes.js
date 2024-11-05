// routes/fileRoutes.js
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const FileMetadata = require("../models/FileMetadata");
require("dotenv").config();

const router = express.Router();

// Setup GridFS bucket
let bucket;
const setupBucket = () => {
    if (!mongoose.connection.db) {
        console.log("Waiting for MongoDB connection...");
        return;
    }
    try {
        bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "uploads"
        });
        console.log("✅ GridFS bucket initialized");
    } catch (error) {
        console.error("❌ GridFS bucket initialization error:", error);
    }
};

// Initialize bucket when MongoDB connects
mongoose.connection.once("open", setupBucket);

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        // Optional: Add file type validation here
        cb(null, true);
    }
});

// Helper function to ensure bucket is initialized
const ensureBucket = async () => {
    if (!bucket) {
        setupBucket();
        if (!bucket) {
            throw new Error("Storage system not initialized");
        }
    }
    return bucket;
};

// POST: Upload file
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        // Validate request
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        if (!req.body.title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        // Get bucket
        const gridFsBucket = await ensureBucket();

        // Check for existing file
        const existingFile = await FileMetadata.findOne({ title: req.body.title });
        if (existingFile) {
            return res.status(400).json({
                success: false,
                message: "File with this title already exists"
            });
        }

        // Create upload stream with metadata
        const uploadStream = gridFsBucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
            metadata: {
                title: req.body.title,
                uploadedBy: req.body.uploadedBy || "unknown"
            }
        });

        // Upload file
        return new Promise((resolve, reject) => {
            uploadStream.end(req.file.buffer, async (error) => {
                if (error) {
                    return reject(error);
                }

                try {
                    // Create metadata document
                    const fileMetadata = new FileMetadata({
                        title: req.body.title,
                        originalFilename: req.file.originalname,
                        uploadedBy: req.body.uploadedBy || "unknown",
                        contentType: req.file.mimetype,
                        size: req.file.size,
                        gridFsFileId: uploadStream.id
                    });

                    await fileMetadata.save();

                    res.status(201).json({
                        success: true,
                        message: "File uploaded successfully",
                        metadata: fileMetadata
                    });
                    resolve();
                } catch (err) {
                    // Cleanup uploaded file if metadata save fails
                    try {
                        await gridFsBucket.delete(uploadStream.id);
                    } catch (deleteError) {
                        console.error("Cleanup error:", deleteError);
                    }
                    reject(err);
                }
            });
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Error uploading file",
            error: error.message
        });
    }
});

// PUT: Update file
router.put("/update/:title", upload.single("file"), async (req, res) => {
    try {
        console.log("Update request for:", req.params.title);
        console.log("Update data:", req.body);

        const gridFsBucket = await ensureBucket();
        
        // Find existing file
        const fileMetadata = await FileMetadata.findOne({ title: req.params.title });
        if (!fileMetadata) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        // If updating title, check if new title exists
        if (req.body.newTitle && req.body.newTitle !== req.params.title) {
            const existingFile = await FileMetadata.findOne({ 
                title: req.body.newTitle,
                _id: { $ne: fileMetadata._id }
            });
            if (existingFile) {
                return res.status(400).json({
                    success: false,
                    message: "New title already exists"
                });
            }
        }

        // Handle file update if new file is provided
        if (req.file) {
            try {
                // Delete old file
                await gridFsBucket.delete(new ObjectId(fileMetadata.gridFsFileId));
            } catch (error) {
                console.warn("Warning: Error deleting old file:", error);
            }

            // Upload new file
            const uploadStream = gridFsBucket.openUploadStream(req.file.originalname, {
                contentType: req.file.mimetype
            });

            await new Promise((resolve, reject) => {
                uploadStream.end(req.file.buffer, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });

            // Update file metadata
            fileMetadata.gridFsFileId = uploadStream.id;
            fileMetadata.originalFilename = req.file.originalname;
            fileMetadata.contentType = req.file.mimetype;
            fileMetadata.size = req.file.size;
        }

        // Update other metadata
        if (req.body.newTitle) {
            fileMetadata.title = req.body.newTitle;
        }
        if (req.body.uploadedBy) {
            fileMetadata.uploadedBy = req.body.uploadedBy;
        }

        await fileMetadata.save();

        res.json({
            success: true,
            message: "File updated successfully",
            metadata: fileMetadata
        });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating file",
            error: error.message
        });
    }
});

// GET: List all files
router.get("/list", async (req, res) => {
    try {
        const files = await FileMetadata.find({})
            .sort({ createdAt: -1 })
            .select('-__v') // Exclude version field
            .lean(); // Convert to plain objects

        res.json({
            success: true,
            count: files.length,
            files: files
        });
    } catch (error) {
        console.error("List error:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving files",
            error: error.message
        });
    }
});

// GET: Download file
router.get("/download/:title", async (req, res) => {
    try {
        const gridFsBucket = await ensureBucket();

        // Find file metadata
        const fileMetadata = await FileMetadata.findOne({ title: req.params.title });
        if (!fileMetadata) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        // Verify file exists in GridFS
        const file = await mongoose.connection.db
            .collection("uploads.files")
            .findOne({ _id: new ObjectId(fileMetadata.gridFsFileId) });

        if (!file) {
            // Clean up orphaned metadata
            await FileMetadata.deleteOne({ _id: fileMetadata._id });
            return res.status(404).json({
                success: false,
                message: "File data not found"
            });
        }

        // Set headers
        res.set({
            'Content-Type': fileMetadata.contentType || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${fileMetadata.originalFilename}"`,
            'Content-Length': fileMetadata.size
        });

        // Stream file
        const downloadStream = gridFsBucket.openDownloadStream(new ObjectId(fileMetadata.gridFsFileId));

        downloadStream.on('error', (error) => {
            console.error("Download stream error:", error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: "Error streaming file"
                });
            }
        });

        downloadStream.pipe(res);

    } catch (error) {
        console.error("Download error:", error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Error downloading file",
                error: error.message
            });
        }
    }
});

// DELETE: Remove specific file
router.delete("/delete/:title", async (req, res) => {
    try {
        const gridFsBucket = await ensureBucket();
        
        // Find file metadata
        const fileMetadata = await FileMetadata.findOne({ title: req.params.title });
        if (!fileMetadata) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        // Delete file from GridFS
        try {
            await gridFsBucket.delete(new ObjectId(fileMetadata.gridFsFileId));
        } catch (error) {
            console.warn(`Warning: Error deleting GridFS file: ${fileMetadata.gridFsFileId}`, error);
        }

        // Delete metadata
        await FileMetadata.deleteOne({ _id: fileMetadata._id });

        res.json({
            success: true,
            message: "File deleted successfully"
        });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting file",
            error: error.message
        });
    }
});

// DELETE: Remove all files (for cleanup)
router.delete("/cleanup", async (req, res) => {
    try {
        const gridFsBucket = await ensureBucket();
        
        // Get all files
        const files = await FileMetadata.find({});
        
        // Delete each file
        for (const file of files) {
            try {
                await gridFsBucket.delete(new ObjectId(file.gridFsFileId));
            } catch (error) {
                console.warn(`Failed to delete GridFS file: ${file.gridFsFileId}`, error);
            }
        }
        
        // Delete all metadata
        await FileMetadata.deleteMany({});
        
        res.json({
            success: true,
            message: "All files cleaned up successfully"
        });
    } catch (error) {
        console.error("Cleanup error:", error);
        res.status(500).json({
            success: false,
            message: "Error during cleanup",
            error: error.message
        });
    }
});

module.exports = router;