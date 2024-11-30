/**
 * @fileoverview API routes for managing text content associated with specific components.
 * Contains endpoints for retrieving, updating, and deleting text content stored in the database.
 */

const express = require("express");
const router = express.Router();
const TextContent = require("../models/TextContent"); // Adjust path as needed

/**
 * @route GET /api/text
 * @description Retrieves text content for a specific component.
 * @queryparam {string} component - The name of the component to retrieve content for.
 * @returns {Object} The content for the specified component or an error message.
 * @throws {400} If the `component` query parameter is not provided.
 * @throws {404} If no content is found for the specified component.
 * @throws {500} If a server error occurs during retrieval.
 */
router.get("/text", async (req, res) => {
  const { component } = req.query;

  if (!component) {
    return res
      .status(400)
      .json({ message: "Component name is required in the query parameters." });
  }

  try {
    const content = await TextContent.findOne({ component });
    if (!content) {
      return res
        .status(404)
        .json({ message: "Content not found for the specified component." });
    }
    res.json(content);
  } catch (error) {
    console.error("Error retrieving content:", error);
    res.status(500).json({
      message: "An error occurred while retrieving content.",
      error: error.message,
    });
  }
});

/**
 * @route PUT /api/text
 * @description Updates or creates text content for a specific component.
 * @bodyparam {string} component - The name of the component to update content for.
 * @bodyparam {string} [content] - The new content to set for the component.
 * @bodyparam {string[]} [paragraphs] - Array of paragraphs to update.
 * @returns {Object} The updated content object.
 * @throws {400} If the `component` field or both `content` and `paragraphs` are missing.
 * @throws {500} If a server error occurs during the update process.
 */
router.put("/text", async (req, res) => {
  const { component, content, paragraphs } = req.body;

  if (!component) {
    return res
      .status(400)
      .json({ message: "Component name is required in the request body." });
  }
  if (content === undefined && !Array.isArray(paragraphs)) {
    return res.status(400).json({
      message:
        "At least one of 'content' or 'paragraphs' is required in the request body.",
    });
  }

  try {
    let textContent = await TextContent.findOne({ component });
    if (!textContent) {
      textContent = new TextContent({ component });
    }

    if (content !== undefined) {
      textContent.content = content;
    }

    if (Array.isArray(paragraphs)) {
      if (paragraphs.length > 0) {
        textContent.paragraphs = paragraphs;
      } else {
        console.warn("Empty paragraphs array provided.");
      }
    }

    await textContent.save();
    res.json(textContent);
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({
      message: "An error occurred while updating content.",
      error: error.message,
    });
  }
});

/**
 * @route DELETE /api/text
 * @description Deletes text content for a specific component.
 * @queryparam {string} component - The name of the component to delete content for.
 * @returns {Object} A success message or an error message.
 * @throws {400} If the `component` query parameter is not provided.
 * @throws {404} If no content is found for the specified component.
 * @throws {500} If a server error occurs during deletion.
 */
router.delete("/text", async (req, res) => {
  const { component } = req.query;

  if (!component) {
    return res
      .status(400)
      .json({ message: "Component name is required in query parameters." });
  }

  try {
    const deletedContent = await TextContent.findOneAndDelete({ component });
    if (!deletedContent) {
      return res
        .status(404)
        .json({ message: "No content found for the specified component." });
    }
    res.json({ message: "Content deleted successfully." });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting content.",
      error: error.message,
    });
  }
});

module.exports = router;
