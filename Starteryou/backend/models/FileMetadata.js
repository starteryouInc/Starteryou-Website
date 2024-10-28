// models/FileMetadata.js
const mongoose = require('mongoose');

const fileMetadataSchema = new mongoose.Schema({
  title: { type: String, required: true }, // New title field
  originalFilename: { type: String, required: true }, // Ensure filename is also required
  uploadedBy: { type: String, required: true }, // Ensure uploadedBy is required for tracking
  createdAt: { type: Date, default: Date.now },
  gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

// Create an index on title for faster searches (optional)
fileMetadataSchema.index({ title: 1 });

module.exports = mongoose.model('FileMetadata', fileMetadataSchema);
