/**
 * Utility function to query and store cache.
 * @module cacheQueryJob
 */
const cacheQueryJob = require("../utils/cacheQueryJob");
/**
 * Cache configuration settings.
 * @module cacheConfig
 */
const cacheConfig = require("../config/cacheConfig");

/** Logger import */
const logger = require("../../utils/logger");

/**
 * Middleware to handle caching for API responses.
 *
 * This middleware checks if a cached response exists for the given request.
 * If a cached response is found, it is returned immediately.
 * Otherwise, the request proceeds, and the response is cached before sending it.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
const cacheMiddlewareJob = async (req, res, next) => {
  try {
    const ttl = cacheConfig.defaultTTL;
    const key = req.originalUrl;

    const cachedResponse = await cacheQueryJob(key, null, ttl);
    if (cachedResponse) {
      logger.info(`✅ Cache hit for key: ${key}`);
      return res.json({ success: true, data: cachedResponse }); // Wrap response properly
    }

    logger.info(`❌ Cache miss for key: ${key}`);

    // Capture response and cache it AFTER sending
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      if (body.success) {
        logger.info(`💾 Caching response for key: ${key}`);
        await cacheQueryJob(key, async () => body.data, ttl);
      }
      originalJson(body);
    };

    next();
  } catch (error) {
    logger.error("❌ Error in cacheMiddleware:", error);
    next();
  }
};

module.exports = cacheMiddlewareJob;
