const cacheQuery = require("../utils/cacheQuery");
const cacheConfig = require("../config/cacheConfig");
const logger = require("../../utils/logger"); // Logger import

const cacheMiddleware = async (req, res, next) => {
  try {
    const ttl = cacheConfig.defaultTTL; // Default TTL for cache entries
    const key = req.originalUrl; // Use the request URL as the cache key

    // Check if a cached response exists
    const cachedResponse = await cacheQuery(key, null, ttl);
    if (cachedResponse) {
      logger.info(`✅ Cache hit for key: ${key}`);
      return res.json(cachedResponse); // Send cached response
    }

    logger.info(`❌ Cache miss for key: ${key}`);

    // Overwrite `res.json` to cache the response
    const originalSend = res.json.bind(res);
    res.json = async (body) => {
      try {
        logger.info(`🔄 Caching response for key: ${key}`);
        await cacheQuery(key, async () => body, ttl); // Cache the response
      } catch (error) {
        logger.error(`❌ Error caching response for key: ${key}`, error);
      }
      originalSend(body); // Send the original response
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    logger.error("❌ Error in cacheMiddleware:", error);
    next(); // Ensure the request proceeds even if cache logic fails
  }
};

module.exports = cacheMiddleware;
