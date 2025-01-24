const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const TextContent = require("../models/TextContent"); // Adjust path as needed
const cacheMiddleware = require("../cache/utils/cacheMiddleware");
const cacheQuery = require("../cache/utils/cacheQuery");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const cacheConfig = require("../cache/config/cacheConfig");
require("dotenv").config();
const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

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
        url: `${backendUrl}/api/text`, // Replace with your base URL
      },
    ],
  },
  apis: [__filename], // Specify the file where your API routes are defined
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Use Swagger UI
router.use("/api-test", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /text:
 *   get:
 *     tags:
 *       - TextRoutes
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
router.get("/text", cacheMiddleware, async (req, res) => {
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

    const cacheKey = component
      ? `/api/text?page=${page}&component=${component}`
      : `/api/text?page=${page}`;
    /**
     * Queries the cache or fetches and caches content if not found
     * 
     * @param {string} cacheKey - Unique key for caching the content
     * @param {Function} fetchFunction - Async function to retrieve content if not in cache
     * @param {number} ttl - Time-to-live for the cache entry
     * 
     * @returns {Object} Cached or freshly retrieved content with status
     */
    const cachedResponse = await cacheQuery(cacheKey, async () => {
      if (component) {
        const content = await TextContent.findOne({ page, component }).maxTimeMS(
          10000
        );
        if (!content) {
          return { status: 404, response: { message: "Content not found for the specified page and component." } };
        }
        return { status: 200, response: content };
      }

      const content = await TextContent.find({ page }).maxTimeMS(10000);
      if (!content || content.length === 0) {
        return { status: 404, response: { message: `No content found for the specified page: ${page}` } };
      }
      return { status: 200, response: content };
    }, cacheConfig.defaultTTL);

    return res.status(cachedResponse.status).json(cachedResponse.response);
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
 *     tags:
 *       - TextRoutes
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
    // Cache invalidation after update
    /**
     * Invalidates the existing cache entry for the updated content
     * 
     * @param {string} cacheKey - Unique key for the content cache
     */
    // Invalidate the cache for the updated content
    const cacheKey = `/api/text?page=${page}&component=${component}`;
    await invalidateCache(cacheKey);

    // Re-cache the updated content
    /**
     * Caches the newly updated content
     * 
     * @param {string} cacheKey - Unique key for caching the content
     * @param {Function} cacheFunction - Function to return the content to cache
     * @param {number} ttl - Time-to-live for the cache entry
     */
    // Set the updated content in the cache
    await cacheQuery(cacheKey, async () => {
      return { status: 200, response: textContent };
    }, cacheConfig.defaultTTL);

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
 *     tags:
 *       - TextRoutes
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

    // Cache invalidation after deletion
    /**
     * Removes the cache entry for the deleted content
     * 
     * @param {string} cacheKey - Unique key for the content cache
     */
    // Invalidate the cache for the deleted content
    const cacheKey = `/api/text?page=${page}&component=${component}`;
    await invalidateCache(cacheKey);

    res.json({ message: "Content deleted successfully." });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting content.",
      error: error.message,
    });
  }
});

module.exports = router;