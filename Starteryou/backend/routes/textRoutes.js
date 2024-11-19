// routes/api/text.js
const express = require("express");
const router = express.Router();
const TextContent = require("../models/TextContent"); // Adjust path as needed

// Route to retrieve text content for a specific component
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
    console.error("Error retrieving content:", error); // Log server-side for debugging
    res.status(500).json({
      message: "An error occurred while retrieving content.",
      error: error.message,
    });
  }
});

// Route to update text content for a specific component
router.put("/text", async (req, res) => {
  const { component, content, paragraphs } = req.body;

  // Check if required fields are provided
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

    // Update content if provided
    if (content !== undefined) {
      textContent.content = content;
    }

    // Validate and update paragraphs if provided
    if (Array.isArray(paragraphs)) {
      if (paragraphs.length > 0) {
        textContent.paragraphs = paragraphs;
      } else {
        console.warn("Empty paragraphs array provided."); // Server log for empty array
      }
    }

    await textContent.save();
    res.json(textContent);
  } catch (error) {
    console.error("Error updating content:", error); // Log server-side for debugging
    res.status(500).json({
      message: "An error occurred while updating content.",
      error: error.message,
    });
  }
});

// Route for deletion
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

// test api
// GET
// http://localhost:5000/api/text?component=OurMission

// PUT
// http://localhost:5000/api/text
// {
//   "component": "YourComponentName",
//   "content": "Updated content here",
//   "paragraphs": ["Paragraph 1", "Paragraph 2"]
// }
