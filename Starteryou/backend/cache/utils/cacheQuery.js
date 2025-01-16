const mongoose = require('mongoose');
const Cache = require('./cache/models/cache');

const cacheQuery = async (key, queryFn, ttl) => {
  try {
    const cachedEntry = await Cache.findOne({ key });
    if (cachedEntry && new Date() < new Date(cachedEntry.expiresAt)) {
      return cachedEntry.value;
    }

    const value = await queryFn();
    const expiresAt = new Date(Date.now() + ttl * 1000);

    await Cache.updateOne(
      { key },
      { key, value, expiresAt },
      { upsert: true }
    );

    return value;
  } catch (error) {
    console.error(`❌ Error in cacheQuery for key: ${key}`, error);
    return null;
  }
};

module.exports = { cacheQuery };