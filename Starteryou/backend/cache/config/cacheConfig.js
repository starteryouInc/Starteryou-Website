require("dotenv").config(); // Load environment variables
const logger = require("../../utils/logger"); //Logger import
const cacheConfig = {
  // Cache TTL (Time to Live) in seconds
  defaultTTL: 3600, // 1 hour
  staticAssetsTTL: 86400, // 1 day for static assets
  dynamicDataTTL: 1800, // 30 minutes for dynamic data

  // MongoDB Cache Collection
  mongoCacheCollection: "Cache",

  // Cache Size Limits
  maxCacheSize: 10000, // Maximum number of entries in the cache

  // Utility to log the configuration for debugging
  logConfig() {
    logger.info("Cache Configuration Loaded:", {
      defaultTTL: this.defaultTTL,
      staticAssetsTTL: this.staticAssetsTTL,
      dynamicDataTTL: this.dynamicDataTTL,
      maxCacheSize: this.maxCacheSize,
    });
  },
};

module.exports = cacheConfig;
