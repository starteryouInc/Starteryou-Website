const cacheQueryJob = require("../utils/cacheQueryJob");
const cacheConfig = require("../config/cacheConfig");

const cacheMiddlewareJob = async (req, res, next) => {
  try {
    const ttl = cacheConfig.defaultTTL;
    const key = req.originalUrl;

    const cachedResponse = await cacheQueryJob(key, null, ttl);
    if (cachedResponse) {
      console.log(`✅ Cache hit for key: ${key}`);
      return res.json({ success: true, data: cachedResponse }); // Wrap response properly
    }

    console.log(`❌ Cache miss for key: ${key}`);

    // Capture response and cache it AFTER sending
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      if (body.success) {
        console.log(`💾 Caching response for key: ${key}`);
        await cacheQueryJob(key, async () => body.data, ttl);
      }
      originalJson(body);
    };

    next();
  } catch (error) {
    console.error("❌ Error in cacheMiddleware:", error);
    next();
  }
};

module.exports = cacheMiddlewareJob;
