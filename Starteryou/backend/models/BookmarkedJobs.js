const mongoose = require("mongoose");

/**
 * Mongoose schema for storing bookmarked jobs by users.
 * 
 * @typedef {Object} BookmarkedJob
 * @property {mongoose.Schema.Types.ObjectId} userId - The ID of the user who bookmarked the job.
 * @property {mongoose.Schema.Types.ObjectId} jobId - The ID of the job that was bookmarked.
 * @property {Date} bookmarkedAt - The date and time when the job was bookmarked.
 */
const bookmarkedSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    bookmarkedAt: {
        type: Date,
        default: Date.now,
    },
});

/**
 * Mongoose model for the BookmarkedJob schema.
 * 
 * @module BookmarkedJob
 * @type {mongoose.Model<BookmarkedJob>}
 */
module.exports = mongoose.model("BookmarkedJob", bookmarkedSchema);
