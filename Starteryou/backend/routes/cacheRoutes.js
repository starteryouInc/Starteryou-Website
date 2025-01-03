const express = require('express');
const mongoose = require('mongoose');
const { invalidateCache } = require('../cache/utils/invalidateCache');
const cacheMiddleware = require('../cache/utils/cacheMiddleware');
const TextContent = require('../models/TextContent'); 
const FileMetadata = require('../models/FileMetadata');
const router = express.Router();

// Placeholder functions for demonstration
const getTextById = async (id) => await TextContent.findById(id);
const updateTextById = async (id, data) => await TextContent.findByIdAndUpdate(id, data, { new: true });
const deleteTextById = async (id) => await TextContent.findByIdAndDelete(id);
const getFileById = async (id) => await FileMetadata.findById(id);
const updateFileById = async (id, data) => await FileMetadata.findByIdAndUpdate(id, data, { new: true });
const deleteFileById = async (id) => await FileMetadata.findByIdAndDelete(id);

// Validate ObjectId middleware
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ObjectId" });
    }
    next();
};

// Text Routes
router.get('/text/:id', validateObjectId, cacheMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const text = await getTextById(id);
        if (!text) {
            return res.status(404).json({ message: "Text not found" });
        }
        res.json(text);
    } catch (error) {
        console.error("Error fetching text:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put('/text/:id', validateObjectId, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedText = await updateTextById(id, req.body);
        if (!updatedText) {
            return res.status(404).json({ message: "Text not found" });
        }
        await invalidateCache(req.originalUrl);
        res.json(updatedText);
    } catch (error) {
        console.error("Error updating text:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete('/text/:id', validateObjectId, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedText = await deleteTextById(id);
        if (!deletedText) {
            return res.status(404).json({ message: "Text not found" });
        }
        await invalidateCache(req.originalUrl);
        res.json({ message: 'Text deleted' });
    } catch (error) {
        console.error("Error deleting text:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// File Routes
router.get('/file/:id', validateObjectId, cacheMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const file = await getFileById(id);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        res.json(file);
    } catch (error) {
        console.error("Error fetching file:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put('/file/:id', validateObjectId, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFile = await updateFileById(id, req.body);
        if (!updatedFile) {
            return res.status(404).json({ message: "File not found" });
        }
        await invalidateCache(req.originalUrl);
        res.json(updatedFile);
    } catch (error) {
        console.error("Error updating file:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete('/file/:id', validateObjectId, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFile = await deleteFileById(id);
        if (!deletedFile) {
            return res.status(404).json({ message: "File not found" });
        }
        await invalidateCache(req.originalUrl);
        res.json({ message: 'File deleted' });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;