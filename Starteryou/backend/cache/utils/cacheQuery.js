const Cache = require("../models/cache");
const logger = require("../../utils/logger"); // Logger import

const cacheQuery = async (key, queryFn, ttl) => {
  try {
    logger.info(`🔍 Checking cache for key: ${key}`);
    const cacheEntry = await Cache.findOne({ key });
    if (cacheEntry && cacheEntry.expiresAt > new Date()) {
      logger.info(`✅ Cache hit for key: ${key}`);
      return cacheEntry.value;
    }

    logger.info(`❌ Cache miss for key: ${key}`);
    if (queryFn) {
      const result = await queryFn();
      const expiresAt = new Date(Date.now() + ttl * 1000);
      logger.info(
        `💾 Storing result in cache for key: ${key} with TTL: ${ttl} seconds`
      );
      await Cache.findOneAndUpdate(
        { key },
        { value: result, expiresAt },
        { upsert: true }
      );
      logger.info(`✅ Cache stored for key: ${key}`);
      return result;
    }

    return null;
  } catch (error) {
    logger.error(`❌ Error in cacheQuery for key: ${key}`, error);
    return null;
  }
};

module.exports = cacheQuery;
