/**
 * Cache model for storing cached data.
 * @module Cache
 */
const Cache = require("../models/cache");

/** Logger import */
const logger = require("../../utils/logger");

/**
 * Queries the cache for a stored value, and if not found, executes a function to fetch and store the result.
 *
 * @param {string} key - The cache key to query.
 * @param {Function|null} queryFn - Function to execute if cache miss occurs.
 * @param {number} ttl - Time-to-live (TTL) for cache in seconds.
 * @returns {Promise<any>} - The cached or newly fetched value.
 */
const cacheQueryJob = async (key, queryFn, ttl) => {
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
        { $set: { value: result, expiresAt } },
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

module.exports = cacheQueryJob;
