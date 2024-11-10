/**
 * @file routes/fileRoutes.js
 * @description This file contains routes for file upload, update, download, list, delete, and cleanup operations using GridFS and MongoDB.
 */

const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const FileMetadata = require("../models/FileMetadata");
require("dotenv").config();

const router = express.Router();

/**
 * Setup GridFS bucket for storing and retrieving files.
 * It initializes the GridFS bucket once the MongoDB connection is open.
 */
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

// Configure multer storage and file limits
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
    fileFilter: (req, file, cb) => {
        // Optional: Add file type validation here
        cb(null, true);
    }
});

/**
 * Ensures the GridFS bucket is initialized before performing file operations.
 * @returns {Object} The GridFS bucket instance.
 * @throws Will throw an error if the storage system is not initialized.
 */
const ensureBucket = async () => {
    if (!bucket) {
        setupBucket();
        if (!bucket) {
            throw new Error("Storage system not initialized");
        }
    }
    return bucket;
};

/**
 * Route to handle file upload.
 * @route POST /upload
 * @param {string} req.body.title - The title of the uploaded file.
 * @param {string} req.body.uploadedBy - The user uploading the file (optional).
 * @param {object} req.file - The file object containing file data.
 * @returns {object} Success or error response.
 */
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

        const gridFsBucket = await ensureBucket();

        // Check if file already exists
        const existingFile = await FileMetadata.findOne({ title: req.body.title });
        if (existingFile) {
            return res.status(400).json({
                success: false,
                message: "File with this title already exists"
            });
        }

        // Create and upload stream
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
                    // Cleanup if metadata save fails
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

/**
 * Route to handle file update based on title.
 * @route PUT /update/:title
 * @param {string} req.params.title - The title of the file to update.
 * @param {object} req.file - The new file object containing file data.
 * @returns {object} Success or error response.
 */
router.put("/update/:title", upload.single("file"), async (req, res) => {
    try {
        const gridFsBucket = await ensureBucket();
        
        // Find existing file
        const fileMetadata = await FileMetadata.findOne({ title: req.params.title });
        if (!fileMetadata) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        // Handle file update if new file is provided
        if (req.file) {
            try {
                // Delete old file
                await gridFsBucket.delete(new ObjectId(fileMetadata.gridFsFileId));
                console.log('Old file deleted successfully:', fileMetadata.gridFsFileId);
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

        // Save the unchanged metadata
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

/**
 * Route to retrieve a list of all files.
 * @route GET /list
 * @returns {object} List of files in the database.
 */
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

/**
 * Route to download a file based on its title.
 * @route GET /download/:title
 * @param {string} req.params.title - The title of the file to download.
 * @returns {object} The file stream for download.
 */
router.get("/download/:title", async (req, res) => {
    try {
        const gridFsBucket = await ensureBucket();

        const fileMetadata = await FileMetadata.findOne({ title: req.params.title });
        if (!fileMetadata) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        const file = await mongoose.connection.db
            .collection("uploads.files")
            .findOne({ _id: new ObjectId(fileMetadata.gridFsFileId) });

        if (!file) {
            await FileMetadata.deleteOne({ _id: fileMetadata._id });
            return res.status(404).json({
                success: false,
                message: "File data not found"
            });
        }

        const sanitizedFilename = fileMetadata.originalFilename.replace(/[^\x20-\x7E]/g, '');
        const encodedFilename = encodeURIComponent(sanitizedFilename);

        res.set({
            'Content-Type': fileMetadata.contentType || 'application/octet-stream',
            'Content-Disposition': `inline; filename="${encodedFilename}"`,
            'Content-Length': fileMetadata.size
        });

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

/**
 * Route to delete a specific file based on its title.
 * @route DELETE /delete/:title
 * @param {string} req.params.title - The title of the file to delete.
 * @returns {object} Success or error response.
 */
router.delete("/delete/:title", async (req, res) => {
    try {
        const gridFsBucket = await ensureBucket();

        const fileMetadata = await FileMetadata.findOne({ title: req.params.title });
        if (!fileMetadata) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        await gridFsBucket.delete(new ObjectId(fileMetadata.gridFsFileId));
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

/**
 * Route to clean up and delete all files from GridFS and their metadata.
 * @route DELETE /cleanup
 * @returns {object} Success or error response.
 */
router.delete("/cleanup", async (req, res) => {
    try {
        const gridFsBucket = await ensureBucket();

        const files = await FileMetadata.find({});
        
        for (const file of files) {
            try {
                await gridFsBucket.delete(new ObjectId(file.gridFsFileId));
            } catch (error) {
                console.warn(`Failed to delete GridFS file: ${file.gridFsFileId}`, error);
            }
        }

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
