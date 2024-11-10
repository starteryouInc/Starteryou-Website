/**
 * Verification Routes for managing file metadata and GridFS health.
 * 
 * This module provides routes for verifying and repairing files stored in GridFS,
 * checking metadata, and ensuring file integrity.
 * 
 * @module verificationRoutes
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const FileMetadata = require("../models/FileMetadata");

/**
 * Route to verify the integrity of a specific file by its title.
 * Checks whether the file exists in GridFS, whether it has associated chunks,
 * and whether it is healthy (i.e., has file data and chunks).
 * 
 * @route GET /api/system/verify/:title
 * @param {string} req.params.title - The title of the file to verify.
 * @returns {Object} JSON response with the file's verification details and health status.
 */
router.get("/verify/:title", async (req, res) => {
    try {
        // Find metadata
        const metadata = await FileMetadata.findOne({ title: req.params.title });
        if (!metadata) {
            return res.status(404).json({
                success: false,
                message: "File metadata not found"
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
                createdAt: metadata.createdAt
            },
            gridfs: {
                exists: !!gridFsFile,
                size: gridFsFile ? gridFsFile.length : 0,
                chunkCount: chunksCount,
                contentType: gridFsFile ? gridFsFile.contentType : null
            }
        };

        res.json({
            success: true,
            file: fileStatus,
            isHealthy: !!(gridFsFile && chunksCount > 0)
        });

    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            success: false,
            message: "Error during verification",
            error: error.message
        });
    }
});

/**
 * Route to verify the integrity of all files.
 * Checks whether each file exists in GridFS, has chunks, and its overall health.
 * Provides a summary of healthy and problematic files.
 * 
 * @route GET /api/system/verify-all
 * @returns {Object} JSON response with a summary of all file verification results.
 */
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
                    size: gridFsFile ? gridFsFile.length : 0
                }
            });
        }

        res.json({
            success: true,
            summary: {
                totalFiles: files.length,
                healthyFiles,
                problematicFiles
            },
            results: verificationResults
        });

    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            success: false,
            message: "Error during verification",
            error: error.message
        });
    }
});

/**
 * Route to repair a file's metadata if it's found to be missing information.
 * The file's metadata will be updated with missing information from GridFS (if available),
 * or orphaned metadata will be cleaned up if the file no longer exists in GridFS.
 * 
 * @route POST /api/system/repair/:title
 * @param {string} req.params.title - The title of the file to repair.
 * @returns {Object} JSON response indicating whether the file was repaired or orphaned metadata was deleted.
 */
router.post("/repair/:title", async (req, res) => {
    try {
        const metadata = await FileMetadata.findOne({ title: req.params.title });
        if (!metadata) {
            return res.status(404).json({
                success: false,
                message: "File metadata not found"
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
                action: "deleted_metadata"
            });
        }

        // Update metadata with missing information
        const updates = {};
        if (!metadata.contentType) {
            updates.contentType = gridFsFile.contentType || 'application/octet-stream';
        }
        if (!metadata.size) {
            updates.size = gridFsFile.length || 0;
        }

        if (Object.keys(updates).length > 0) {
            await FileMetadata.updateOne(
                { _id: metadata._id },
                { $set: updates }
            );
        }

        res.json({
            success: true,
            message: "File repaired",
            updates
        });

    } catch (error) {
        console.error("Repair error:", error);
        res.status(500).json({
            success: false,
            message: "Error during repair",
            error: error.message
        });
    }
});

module.exports = router;
