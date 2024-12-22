const mongoose = require("mongoose"); // Import mongoose
// In your FileMetadata.js model
const fileMetadataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  originalFilename: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

// Add indexes
fileMetadataSchema.index({ title: 1 }, { unique: true });
fileMetadataSchema.index({ gridFsFileId: 1 });

module.exports = mongoose.model("FileMetadata", fileMetadataSchema);
