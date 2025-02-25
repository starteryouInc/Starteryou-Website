const cacheQuery = require("../utils/cacheQuery");
const cacheConfig = require("../config/cacheConfig");

const cacheMiddleware = async (req, res, next) => {
  try {
    const ttl = cacheConfig.defaultTTL; // Default TTL for cache entries
    const key = req.originalUrl; // Use the request URL as the cache key

    // Check if a cached response exists
    const cachedResponse = await cacheQuery(key, null, ttl);
    if (cachedResponse) {
      console.log(`✅ Cache hit for key: ${key}`);
      return res.json(cachedResponse); // Send cached response
    }

    console.log(`❌ Cache miss for key: ${key}`);

    // Overwrite `res.json` to cache the response
    const originalSend = res.json.bind(res);
    res.json = async (body) => {
      try {
        console.log(`🔄 Caching response for key: ${key}`);
        await cacheQuery(key, async () => body, ttl); // Cache the response
      } catch (error) {
        console.error(`❌ Error caching response for key: ${key}`, error);
      }
      originalSend(body); // Send the original response
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("❌ Error in cacheMiddleware:", error);
    next(); // Ensure the request proceeds even if cache logic fails
  }
};

module.exports = cacheMiddleware;
