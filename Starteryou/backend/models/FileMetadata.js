/**
 * FileMetadata Model for storing information about uploaded files.
 * 
 * This model represents metadata for a file stored in GridFS, including details like:
 * - `title`: The title of the file
 * - `originalFilename`: The original name of the file
 * - `uploadedBy`: The user who uploaded the file
 * - `createdAt`: Timestamp of when the file was uploaded (default is the current time)
 * - `gridFsFileId`: The unique identifier of the file in GridFS (used to retrieve the actual file)
 * 
 * The model uses MongoDB with Mongoose to store file metadata and supports the following indexes:
 * - A unique index on `title` to prevent duplicate file uploads with the same title.
 * - An index on `gridFsFileId` for faster retrieval of files based on their GridFS ID.
 * 
 * @module FileMetadata
 */

const mongoose = require("mongoose");

// Define the file metadata schema
const fileMetadataSchema = new mongoose.Schema({
  /**
   * The title of the file.
   * @type {string}
   * @required
   */
  title: { type: String, required: true },

  /**
   * The original filename of the uploaded file.
   * @type {string}
   * @required
   */
  originalFilename: { type: String, required: true },

  /**
   * The user who uploaded the file.
   * @type {string}
   * @required
   */
  uploadedBy: { type: String, required: true },

  /**
   * The timestamp when the file was uploaded.
   * @type {Date}
   * @default Date.now
   */
  createdAt: { type: Date, default: Date.now },

  /**
   * The ObjectId of the file in GridFS.
   * @type {mongoose.Schema.Types.ObjectId}
   * @required
   */
  gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

// Add indexes to the schema
fileMetadataSchema.index({ title: 1 }, { unique: true }); // Ensure unique titles
fileMetadataSchema.index({ gridFsFileId: 1 }); // Index for GridFS file retrieval

// Export the model
module.exports = mongoose.model("FileMetadata", fileMetadataSchema);
