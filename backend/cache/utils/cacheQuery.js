const Cache = require('../models/cache');

    const cacheQuery = async (key, queryFn, ttl) => {
        try {
            console.log(`🔍 Checking cache for key: ${key}`);
            const cacheEntry = await Cache.findOne({ key });
            if (cacheEntry && cacheEntry.expiresAt > new Date()) {
                console.log(`✅ Cache hit for key: ${key}`);
                return cacheEntry.value;
            }

            console.log(`❌ Cache miss for key: ${key}`);
            if (queryFn) {
                const result = await queryFn();
                const expiresAt = new Date(Date.now() + ttl * 1000);
                console.log(`💾 Storing result in cache for key: ${key} with TTL: ${ttl} seconds`);
                await Cache.findOneAndUpdate(
                    { key },
                    { value: result, expiresAt },
                    { upsert: true }
                );
                console.log(`✅ Cache stored for key: ${key}`);
                return result;
            }

            return null;
        } catch (error) {
            console.error(`❌ Error in cacheQuery for key: ${key}`, error);
            return null;
        }
    };

    module.exports = cacheQuery;