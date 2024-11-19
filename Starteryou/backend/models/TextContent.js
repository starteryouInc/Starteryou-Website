// models/TextContent.js
const mongoose = require("mongoose");

const textContentSchema = new mongoose.Schema(
  {
    component: { type: String, required: true },
    content: { type: String, required: true, default: "" },
    paragraphs: { type: [String], default: [] }, // Always an array, even for single paragraphs
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("TextContent", textContentSchema);
