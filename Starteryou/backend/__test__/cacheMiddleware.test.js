const cacheMiddleware = require('../cache/utils/cacheMiddleware');
const cacheQuery = require('../cache/utils/cacheQuery');
const cacheConfig = require('../cache/config/cacheConfig');

// Mock dependencies
jest.mock('../cache/utils/cacheQuery');
jest.mock('../cache/config/cacheConfig', () => ({
  defaultTTL: 3600, // 1 hour 
  staticAssetsTTL: 86400,
  dynamicDataTTL: 1800,
  mongoCacheCollection: "Cache",
  maxCacheSize: 10000,
  logConfig: jest.fn()
}));

describe('cacheMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
    
    // Setup request, response, and next function mocks
    req = {
      originalUrl: '/api/test'
    };
    
    res = {
      json: jest.fn().mockReturnThis()
    };
    
    next = jest.fn();
  });

  // Test 1: Cache hit - should return cached response and not call next
  test('should return cached response on cache hit', async () => {
    const cachedData = { data: 'cached-response' };
    cacheQuery.mockResolvedValueOnce(cachedData);
    
    await cacheMiddleware(req, res, next);
    
    expect(cacheQuery).toHaveBeenCalledWith('/api/test', null, cacheConfig.defaultTTL);
    expect(res.json).toHaveBeenCalledWith(cachedData);
    expect(next).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('✅ Cache hit for key: /api/test');
  });

  // Test 2: Cache miss - should modify res.json and call next
  test('should modify res.json and call next on cache miss', async () => {
    cacheQuery.mockResolvedValueOnce(null);
    
    const originalJsonMethod = res.json;
    
    await cacheMiddleware(req, res, next);
    
    expect(cacheQuery).toHaveBeenCalledWith('/api/test', null, cacheConfig.defaultTTL);
    expect(res.json).not.toBe(originalJsonMethod); // Should be replaced with new function
    expect(next).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('❌ Cache miss for key: /api/test');
  });

  // Test 3: Modified res.json should cache responses
  test('modified res.json should cache the response body', async () => {
    cacheQuery.mockResolvedValueOnce(null); // Initial cache miss
    
    await cacheMiddleware(req, res, next);
    
    // Reset cacheQuery mock for the second call
    cacheQuery.mockReset();
    cacheQuery.mockResolvedValueOnce(true); // Mock successful caching
    
    // Simulate route handler calling res.json with data
    const responseData = { message: 'success', data: [1, 2, 3] };
    await res.json(responseData);
    
    // Verify cacheQuery was called with correct parameters
    expect(cacheQuery).toHaveBeenCalledWith(
      '/api/test', 
      expect.any(Function), 
      cacheConfig.defaultTTL
    );
    
    // Verify the function passed to cacheQuery returns the response body
    const cacheQueryFn = cacheQuery.mock.calls[0][1];
    const result = await cacheQueryFn();
    expect(result).toEqual(responseData);
    
    expect(console.log).toHaveBeenCalledWith('🔄 Caching response for key: /api/test');
  });

  // Test 4: Error in cacheQuery during initial check
  test('should call next if cacheQuery throws an error during initial check', async () => {
    cacheQuery.mockRejectedValueOnce(new Error('Cache error'));
    
    await cacheMiddleware(req, res, next);
    
    expect(cacheQuery).toHaveBeenCalledWith('/api/test', null, cacheConfig.defaultTTL);
    expect(next).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('❌ Error in cacheMiddleware:', expect.any(Error));
  });

  // Test 5: Error when caching response
test('should handle errors when caching response', async () => {
    cacheQuery.mockResolvedValueOnce(null); // Initial cache miss
    
    // Keep a reference to the original res.json mock
    const originalJson = res.json;
    
    await cacheMiddleware(req, res, next);
    
    // Reset cacheQuery mock for the second call
    cacheQuery.mockReset();
    cacheQuery.mockRejectedValueOnce(new Error('Cache error'));
    
    // Original res.json should still be called even if caching fails
    const responseData = { message: 'success' };
    await res.json(responseData);
    
    expect(console.error).toHaveBeenCalledWith(
      '❌ Error caching response for key: /api/test', 
      expect.any(Error)
    );
    
    // Check that response was sent
    expect(originalJson).toHaveBeenCalledWith(responseData);
  });
  
  // Test 6: Verify res.json preserves response body
  test('modified res.json should preserve the original response body', async () => {
    cacheQuery.mockResolvedValueOnce(null); // Initial cache miss
    
    // Keep a reference to the original res.json mock
    const originalJson = res.json;
    
    await cacheMiddleware(req, res, next);
    
    // Simulate route handler calling res.json with data
    const responseData = { message: 'success' };
    await res.json(responseData);
    
    // Verify original res.json was called with the same data
    expect(originalJson).toHaveBeenCalledWith(responseData);
  });

  // Test 7: Different request URLs result in different cache keys
  test('should use different cache keys for different request URLs', async () => {
    cacheQuery.mockResolvedValueOnce(null);
    
    req.originalUrl = '/api/different-endpoint';
    
    await cacheMiddleware(req, res, next);
    
    expect(cacheQuery).toHaveBeenCalledWith('/api/different-endpoint', null, cacheConfig.defaultTTL);
  });

  // Test 8: Middleware uses TTL from cacheConfig
  test('should use TTL from cacheConfig', async () => {
    cacheQuery.mockResolvedValueOnce(null);
    
    await cacheMiddleware(req, res, next);
    
    expect(cacheQuery).toHaveBeenCalledWith('/api/test', null, 3600); // actual defaultTTL (1 hour)
  });
});