const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const TextContent = require("../models/TextContent"); // Adjust path as needed

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Text Content API",
      version: "1.0.0",
      description:
        "API for managing text content associated with specific components",
    },
    servers: [
      {
        url: "http://dev.starteryou.com:3000/api/text", // Replace with your base URL
      },
    ],
  },
  apis: [__filename], // Specify the file where your API routes are defined
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Use Swagger UI
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /text:
 *   get:
 *     summary: Retrieves text content for a specific component.
 *     description: Retrieve content stored in the database for a given page and component.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the page to retrieve content for.
 *       - in: query
 *         name: component
 *         schema:
 *           type: string
 *         required: false
 *         description: The name of the component to retrieve content for.
 *     responses:
 *       200:
 *         description: Content retrieved successfully.
 *       400:
 *         description: Missing or invalid query parameters.
 *       404:
 *         description: No content found.
 *       500:
 *         description: Server error.
 */
router.get("/text", async (req, res) => {
  const { page, component } = req.query;

  if (!page) {
    return res.status(400).json({
      message: "'page' is required in query parameters.",
    });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        message: "MongoDB connection lost or not ready.",
      });
    }

    if (component) {
      const content = await TextContent.findOne({ page, component }).maxTimeMS(
        10000
      );
      if (!content) {
        return res.status(404).json({
          message: "Content not found for the specified page and component.",
        });
      }
      return res.json(content);
    }

    const content = await TextContent.find({ page }).maxTimeMS(10000);
    if (!content || content.length === 0) {
      return res.status(404).json({
        message: `No content found for the specified page: ${page}`,
      });
    }
    return res.json(content);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving content.",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /text:
 *   put:
 *     summary: Updates or creates text content for a specific component.
 *     description: Update or create content in the database for a given page and component.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: string
 *               component:
 *                 type: string
 *               content:
 *                 type: string
 *               paragraphs:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Content updated or created successfully.
 *       400:
 *         description: Missing or invalid request body.
 *       500:
 *         description: Server error.
 */
router.put("/text", async (req, res) => {
  const { page, component, content, paragraphs } = req.body;

  if (!page || !component) {
    return res.status(400).json({
      message: "Both 'page' and 'component' are required in the request body.",
    });
  }
  if (content === undefined && !Array.isArray(paragraphs)) {
    return res.status(400).json({
      message:
        "At least one of 'content' or 'paragraphs' is required in the request body.",
    });
  }

  try {
    let textContent = await TextContent.findOne({ page, component }).maxTimeMS(
      10000
    );

    if (!textContent) {
      textContent = new TextContent({ page, component });
    }

    if (content !== undefined) {
      textContent.content = content;
    }

    if (Array.isArray(paragraphs)) {
      textContent.paragraphs = paragraphs;
    }

    await textContent.save();
    res.json(textContent);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating content.",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /text:
 *   delete:
 *     summary: Deletes text content for a specific component.
 *     description: Delete content from the database for a given page and component.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the page.
 *       - in: query
 *         name: component
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the component.
 *     responses:
 *       200:
 *         description: Content deleted successfully.
 *       400:
 *         description: Missing or invalid query parameters.
 *       404:
 *         description: No content found.
 *       500:
 *         description: Server error.
 */
router.delete("/text", async (req, res) => {
  const { page, component } = req.query;

  if (!page || !component) {
    return res.status(400).json({
      message: "Both 'page' and 'component' are required in query parameters.",
    });
  }

  try {
    const deletedContent = await TextContent.findOneAndDelete({
      page,
      component,
    });
    if (!deletedContent) {
      return res.status(404).json({
        message: "No content found for the specified page and component.",
      });
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
