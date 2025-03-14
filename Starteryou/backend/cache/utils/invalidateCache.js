const { mongoConnection } = require("../../db"); // Shared MongoDB connection
const Cache = require("../models/cache");
const logger = require("../../utils/logger"); //Logger import

// Invalidate cache for a specific key
const invalidateCache = async (key) => {
  try {
    if (!mongoConnection.readyState) {
      logger.error("❌ MongoDB connection is not established.");
      return;
    }

    const result = await Cache.deleteOne({ key });
    if (result.deletedCount > 0) {
      logger.info(`✅ Cache invalidated for key: ${key}`);
    } else {
      logger.info(`⚠️ No cache entry found for key: ${key}`);
    }
  } catch (error) {
    logger.error(`❌ Error invalidating cache for key: ${key}`, error);
  }
};

// Invalidate cache for keys matching a pattern
const invalidateCacheByPattern = async (pattern) => {
  try {
    if (!mongoConnection.readyState) {
      logger.error("❌ MongoDB connection is not established.");
      return;
    }

    const regex = new RegExp(pattern);
    const result = await Cache.deleteMany({ key: regex });
    logger.info(
      `✅ Cache invalidated for pattern: ${pattern}. ${result.deletedCount} entries removed.`
    );
  } catch (error) {
    logger.error(`❌ Error invalidating cache for pattern: ${pattern}`, error);
  }
};

module.exports = { invalidateCache, invalidateCacheByPattern };
