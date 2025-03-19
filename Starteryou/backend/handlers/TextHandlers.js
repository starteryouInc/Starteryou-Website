// const mongoose = require("mongoose");
const cacheQuery = require("../cache/utils/cacheQuery");
const TextContent = require("../models/TextContent");
const cacheConfig = require("../cache/config/cacheConfig");
// const { invalidateCache } = require("../cache/utils/invalidateCache");

const fetchTextContent = async (req, res) => {
  const { page, component } = req.query;

  if (!page) {
    return res.status(400).json({
      message: "'page' is required in query parameters.",
    });
  }

  try {
    const cacheKey = `/api/text?page=${page}${
      component ? `&component=${component}` : ""
    }`;
    console.log(`Cache Key: ${cacheKey}`);

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
            return null; // instead of throwing an error, return null
          }
          return content;
        }

        const content = await TextContent.find({ page })
          .maxTimeMS(10000)
          .lean();

        if (!content || content.length === 0) {
          console.error(`No content found for page: ${page}`);
          return null; // instead of throwing an error, return null
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
    return res.status(500).json({
      message: "An error occurred while retrieving content.",
      error: error.message,
    });
  }
};

const updateTextContent = async (req, res) => {
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
};
module.exports = { fetchTextContent, updateTextContent };
