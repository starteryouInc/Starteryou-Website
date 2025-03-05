const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const TextContent = require("../models/TextContent"); // Adjust path as needed
require("dotenv").config();
const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
const cacheMiddleware = require("../cache/utils/cacheMiddleware");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const cacheQuery = require("../cache/utils/cacheQuery");
const cacheConfig = require("../cache/config/cacheConfig");
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
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB connection not ready");
      return res.status(500).json({
        message: "MongoDB connection lost or not ready.",
      });
    }

    // Create a cache key
    const cacheKey = `/api/text?page=${page}${
      component ? `&component=${component}` : ""
    }`;
    console.log(`Cache Key: ${cacheKey}`);

    // Fetch data from cache or database
    const cachedContent = await cacheQuery(
      cacheKey,
      async () => {
        console.log("Cache miss, querying database...");
        if (component) {
          const content = await TextContent.findOne({ page, component })
            .maxTimeMS(10000)
            .lean();

          if (!content) {
            console.error(
              `No content found for page: ${page}, component: ${component}`
            );
            throw new Error("Content not found.");
          }
          return content;
        }

        const content = await TextContent.find({ page })
          .maxTimeMS(10000)
          .lean();

        if (!content || content.length === 0) {
          console.error(`No content found for page: ${page}`);
          throw new Error(`No content found for the specified page: ${page}`);
        }
        return content;
      },
      cacheConfig.defaultTTL
    );

    if (!cachedContent) {
      console.error("Content not found in cache or database.");
      return res.status(404).json({
        message: "Content not found in cache or database.",
      });
    }

    return res.json(cachedContent);
  } catch (error) {
    console.error("Error fetching text content:", error);
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
    const cacheKey = `/api/text?page=${page}&component=${component}`;
    console.log(`Invalidating cache for key: ${cacheKey}`);
    await invalidateCache(cacheKey);
    await cacheQuery(cacheKey, async () => textContent, cacheConfig.defaultTTL);
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
    const cacheKey = `/api/text?page=${page}&component=${component}`;
    console.log(`Invalidating cache for key: ${cacheKey}`);
    await invalidateCache(cacheKey);
    res.json({ message: "Content deleted successfully." });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({
      message: "An error occurred while deleting content.",
      error: error.message,
    });
  }
});

module.exports = router;
