/**
 * @fileoverview Mongoose model for storing and managing text content associated with specific components.
 * This model is used to save text and paragraph data for various UI components in the application.
 */

const mongoose = require("mongoose");

/**
 * Mongoose schema for the `TextContent` model.
 * Represents the text content associated with a specific UI component.
 * @typedef {Object} TextContent
 * @property {string} component - The name of the component this content belongs to. (Required)
 * @property {string} content - The main content text for the component. Defaults to an empty string.
 * @property {string[]} paragraphs - An array of paragraphs for the component. Defaults to an empty array.
 * @property {Date} createdAt - Timestamp indicating when the document was created. (Added by `timestamps`)
 * @property {Date} updatedAt - Timestamp indicating when the document was last updated. (Added by `timestamps`)
 */
const textContentSchema = new mongoose.Schema(
  {
    component: { type: String, required: true },
    content: { type: String, required: true, default: "" },
    paragraphs: { type: [String], default: [] }, // Always an array, even for single paragraphs
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

/**
 * Mongoose model for interacting with the `textContent` collection in the database.
 * @module TextContent
 */
module.exports = mongoose.model("TextContent", textContentSchema);
