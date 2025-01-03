const { cacheQuery } = require("../../db");
const cacheConfig = require("../config/cacheConfig");

const cacheMiddleware = async (req, res, next) => {
  try {
    const ttl = cacheConfig.defaultTTL;
    const key = req.originalUrl;

    const cachedResponse = await cacheQuery(key, async () => null, ttl);
    if (cachedResponse) {
      console.log(`✅ Cache hit for key: ${key}`);
      return res.json(cachedResponse);
    }

    console.log(`❌ Cache miss for key: ${key}`);

    const originalSend = res.json.bind(res);
    res.json = async (body) => {
      try {
        console.log(`🔄 Caching response for key: ${key}`);
        await cacheQuery(key, async () => body, ttl);
      } catch (error) {
        console.error(`❌ Error caching response for key: ${key}`, error);
      }
      originalSend(body);
    };

    next();
  } catch (error) {
    console.error("❌ Error in cacheMiddleware:", error);
    next();
  }
};

module.exports = cacheMiddleware;
