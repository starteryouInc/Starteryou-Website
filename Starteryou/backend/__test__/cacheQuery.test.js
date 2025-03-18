const cacheQuery = require('../cache/utils/cacheQuery.js');
const Cache = require('../cache/models/cache.js');

// Mock the Cache model
jest.mock('../cache/models/cache.js', () => ({
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn()
}));

describe('cacheQuery', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  // Test 1: Cache hit - should return cached value without calling queryFn
  test('should return cached value when valid cache entry exists', async () => {
    const mockCacheEntry = {
      key: 'test-key',
      value: { data: 'cached-data' },
      expiresAt: new Date(Date.now() + 1000) // not expired
    };
    
    Cache.findOne.mockResolvedValue(mockCacheEntry);
    
    const queryFn = jest.fn(); // This shouldn't be called
    
    const result = await cacheQuery('test-key', queryFn, 60);
    
    expect(Cache.findOne).toHaveBeenCalledWith({ key: 'test-key' });
    expect(queryFn).not.toHaveBeenCalled();
    expect(result).toEqual({ data: 'cached-data' });
    expect(console.log).toHaveBeenCalledWith('✅ Cache hit for key: test-key');
  });

  // Test 2: Cache miss - should call queryFn and update cache
  test('should call queryFn and update cache when no valid cache entry exists', async () => {
    // No cached entry
    Cache.findOne.mockResolvedValue(null);
    
    const mockData = { data: 'fresh-data' };
    const queryFn = jest.fn().mockResolvedValue(mockData);
    Cache.findOneAndUpdate.mockResolvedValue({ value: mockData });
    
    const result = await cacheQuery('test-key', queryFn, 60);
    
    expect(Cache.findOne).toHaveBeenCalledWith({ key: 'test-key' });
    expect(queryFn).toHaveBeenCalled();
    expect(Cache.findOneAndUpdate).toHaveBeenCalled();
    expect(result).toEqual(mockData);
    expect(console.log).toHaveBeenCalledWith('❌ Cache miss for key: test-key');
    expect(console.log).toHaveBeenCalledWith('💾 Storing result in cache for key: test-key with TTL: 60 seconds');
    expect(console.log).toHaveBeenCalledWith('✅ Cache stored for key: test-key');
  });

  // Test 3: Expired cache - should call queryFn and update cache
  test('should call queryFn and update cache when cache entry is expired', async () => {
    const expiredCacheEntry = {
      key: 'test-key',
      value: { data: 'old-data' },
      expiresAt: new Date(Date.now() - 1000) // expired
    };
    
    Cache.findOne.mockResolvedValue(expiredCacheEntry);
    
    const mockData = { data: 'fresh-data' };
    const queryFn = jest.fn().mockResolvedValue(mockData);
    Cache.findOneAndUpdate.mockResolvedValue({ value: mockData });
    
    const result = await cacheQuery('test-key', queryFn, 60);
    
    expect(Cache.findOne).toHaveBeenCalledWith({ key: 'test-key' });
    expect(queryFn).toHaveBeenCalled();
    expect(Cache.findOneAndUpdate).toHaveBeenCalled();
    expect(result).toEqual(mockData);
    expect(console.log).toHaveBeenCalledWith('❌ Cache miss for key: test-key');
  });

  // Test 4: No queryFn provided - should return null on cache miss
  test('should return null when cache miss and no queryFn provided', async () => {
    Cache.findOne.mockResolvedValue(null);
    
    const result = await cacheQuery('test-key', null, 60);
    
    expect(Cache.findOne).toHaveBeenCalledWith({ key: 'test-key' });
    expect(result).toBeNull();
    expect(console.log).toHaveBeenCalledWith('❌ Cache miss for key: test-key');
  });

  // Test 5: Error handling - should catch errors and return null
  test('should return null and log error when exception occurs', async () => {
    Cache.findOne.mockRejectedValue(new Error('Database error'));
    
    const queryFn = jest.fn();
    
    const result = await cacheQuery('test-key', queryFn, 60);
    
    expect(Cache.findOne).toHaveBeenCalledWith({ key: 'test-key' });
    expect(queryFn).not.toHaveBeenCalled();
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      '❌ Error in cacheQuery for key: test-key',
      expect.any(Error)
    );
  });

  // Test 6: queryFn throws error - should handle and return null
  test('should handle errors from queryFn and return null', async () => {
    Cache.findOne.mockResolvedValue(null);
    
    const queryFn = jest.fn().mockRejectedValue(new Error('Query function error'));
    
    const result = await cacheQuery('test-key', queryFn, 60);
    
    expect(Cache.findOne).toHaveBeenCalledWith({ key: 'test-key' });
    expect(queryFn).toHaveBeenCalled();
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      '❌ Error in cacheQuery for key: test-key',
      expect.any(Error)
    );
  });

  // Test 7: findOneAndUpdate error - should handle and return null
  test('should handle errors from findOneAndUpdate and return null', async () => {
    Cache.findOne.mockResolvedValue(null);
    
    const mockData = { data: 'fresh-data' };
    const queryFn = jest.fn().mockResolvedValue(mockData);
    Cache.findOneAndUpdate.mockRejectedValue(new Error('Update error'));
    
    const result = await cacheQuery('test-key', queryFn, 60);
    
    expect(Cache.findOne).toHaveBeenCalledWith({ key: 'test-key' });
    expect(queryFn).toHaveBeenCalled();
    expect(Cache.findOneAndUpdate).toHaveBeenCalled();
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      '❌ Error in cacheQuery for key: test-key',
      expect.any(Error)
    );
  });

  // Test 8: Verify TTL calculation
  test('should calculate correct expiration time based on TTL', async () => {
    Cache.findOne.mockResolvedValue(null);
    
    const mockData = { data: 'fresh-data' };
    const queryFn = jest.fn().mockResolvedValue(mockData);
    
    jest.spyOn(Date, 'now').mockImplementation(() => 1000);
    
    await cacheQuery('test-key', queryFn, 60);
    
    expect(Cache.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'test-key' },
      { 
        value: mockData, 
        expiresAt: new Date(61000) // 1000 (mocked now) + 60*1000
      },
      { upsert: true }
    );
    
    Date.now.mockRestore();
  });
});