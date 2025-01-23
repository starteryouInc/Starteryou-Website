const mongoose = require("mongoose");

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

module.exports = mongoose.model("BookmarkedJob", bookmarkedSchema);