/**
 * @file invalidateCache.test.js
 * @description Unit tests for cache invalidation utilities.
 * Tests the `invalidateCache` and `invalidateCacheByPattern` functions to ensure they properly remove cache entries.
 */

const { invalidateCache, invalidateCacheByPattern } = require('../cache/utils/invalidateCache');
const { mongoConnection } = require('../db');
const Cache = require('../cache/models/cache');
const logger = require('../utils/logger');

// Mock dependencies
jest.mock('../db', () => ({
  mongoConnection: {
    readyState: 1 // Default to connected
  }
}));

jest.mock('../cache/models/cache', () => ({
  deleteOne: jest.fn(),
  deleteMany: jest.fn()
}));

describe('Cache Invalidation Utils', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock logger methods
    logger.info = jest.fn();
    logger.error = jest.fn();
    
    // Reset mongoConnection readyState to connected
    mongoConnection.readyState = 1;
  });
  /**
   * Test suite for invalidateCache function.
   */
  describe('invalidateCache', () => {
    /**
     * Test 1: Successfully invalidates a specific cache entry.
     */
    test('should successfully invalidate cache for a specific key', async () => {
      // Setup
      const testKey = 'test-key';
      Cache.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });
      
      // Execute
      await invalidateCache(testKey);
      
      // Verify
      expect(Cache.deleteOne).toHaveBeenCalledWith({ key: testKey });
      expect(logger.info).toHaveBeenCalledWith(`✅ Cache invalidated for key: ${testKey}`);
    });

    /**
     * Test 2: Logs a warning when no cache entry is found for the key.
     */
    test('should log a warning when no cache entry is found for the key', async () => {
      // Setup
      const testKey = 'non-existent-key';
      Cache.deleteOne.mockResolvedValueOnce({ deletedCount: 0 });
      
      // Execute
      await invalidateCache(testKey);
      
      // Verify
      expect(Cache.deleteOne).toHaveBeenCalledWith({ key: testKey });
      expect(logger.info).toHaveBeenCalledWith(`⚠️ No cache entry found for key: ${testKey}`);
    });

    /**
     * Test 3: Logs an error when MongoDB connection is not established.
     */
    test('should log an error when MongoDB connection is not established', async () => {
      // Setup
      const testKey = 'test-key';
      mongoConnection.readyState = 0; // Disconnected
      
      // Execute
      await invalidateCache(testKey);
      
      // Verify
      expect(Cache.deleteOne).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith('❌ MongoDB connection is not established.');
    });

    /**
     * Test 4: Handles errors during cache invalidation.
     */
    test('should handle errors when invalidating cache', async () => {
      // Setup
      const testKey = 'test-key';
      const testError = new Error('Test error');
      Cache.deleteOne.mockRejectedValueOnce(testError);
      
      // Execute
      await invalidateCache(testKey);
      
      // Verify
      expect(Cache.deleteOne).toHaveBeenCalledWith({ key: testKey });
      expect(logger.error).toHaveBeenCalledWith(`❌ Error invalidating cache for key: ${testKey}`, testError);
    });
  });
  /**
   * Test suite for invalidateCacheByPattern function.
   */
  describe('invalidateCacheByPattern', () => {
    /**
     * Test 5: Successfully invalidates cache entries matching a pattern.
     */
    test('should successfully invalidate cache entries matching a pattern', async () => {
      // Setup
      const testPattern = 'test.*';
      Cache.deleteMany.mockResolvedValueOnce({ deletedCount: 5 });
      
      // Execute
      await invalidateCacheByPattern(testPattern);
      
      // Verify
      expect(Cache.deleteMany).toHaveBeenCalledWith({ key: expect.any(RegExp) });
      expect(logger.info).toHaveBeenCalledWith(`✅ Cache invalidated for pattern: ${testPattern}. 5 entries removed.`);
    });

    /**
     * Test 6: Logs an error when MongoDB connection is not established for pattern invalidation.
     */
    test('should log an error when MongoDB connection is not established for pattern invalidation', async () => {
      // Setup
      const testPattern = 'test.*';
      mongoConnection.readyState = 0; // Disconnected
      
      // Execute
      await invalidateCacheByPattern(testPattern);
      
      // Verify
      expect(Cache.deleteMany).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith('❌ MongoDB connection is not established.');
    });

    /**
     * Test 7: Handles errors when invalidating cache by pattern.
     */
    test('should handle errors when invalidating cache by pattern', async () => {
      // Setup
      const testPattern = 'test.*';
      const testError = new Error('Test error');
      Cache.deleteMany.mockRejectedValueOnce(testError);
      
      // Execute
      await invalidateCacheByPattern(testPattern);
      
      // Verify
      expect(Cache.deleteMany).toHaveBeenCalledWith({ key: expect.any(RegExp) });
      expect(logger.error).toHaveBeenCalledWith(`❌ Error invalidating cache for pattern: ${testPattern}`, testError);
    });

    /**
     * Test 8: Logs success with zero entries when no matches found for pattern.
     */
    test('should log success with zero entries when no matches found for pattern', async () => {
      // Setup
      const testPattern = 'no-match.*';
      Cache.deleteMany.mockResolvedValueOnce({ deletedCount: 0 });
      
      // Execute
      await invalidateCacheByPattern(testPattern);
      
      // Verify
      expect(Cache.deleteMany).toHaveBeenCalledWith({ key: expect.any(RegExp) });
      expect(logger.info).toHaveBeenCalledWith(`✅ Cache invalidated for pattern: ${testPattern}. 0 entries removed.`);
    });

    /**
     * Test 9: Verifies pattern is correctly converted to a RegExp object.
     */
    test('should correctly convert the pattern to a RegExp object', async () => {
      // Setup
      const testPattern = 'api/users/\\d+';
      Cache.deleteMany.mockResolvedValueOnce({ deletedCount: 3 });
      
      // Execute
      await invalidateCacheByPattern(testPattern);
      
      // Verify
      expect(Cache.deleteMany).toHaveBeenCalled();
      
      // Get the RegExp passed to deleteMany
      const regexArg = Cache.deleteMany.mock.calls[0][0].key;
      
      // Verify it's a RegExp
      expect(regexArg).toBeInstanceOf(RegExp);
      
      // Test that it matches what we expect
      expect('api/users/123').toMatch(regexArg);
      expect('api/users/abc').not.toMatch(regexArg);
    });
  });
});