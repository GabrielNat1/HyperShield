import { CacheService } from '../../src/domains/cache/application/cacheService';
import { CacheConfig } from '../../src/core/types/config';

describe('Redis Cache Integration', () => {
  let cacheService: CacheService;
  const REDIS_TIMEOUT = 5000;

  beforeEach(() => {
    const config: CacheConfig = {
      enabled: true,
      provider: 'redis',
      ttl: 3600,
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    };
    cacheService = new CacheService(config);
  });

  afterEach(async () => {
    await cacheService.clear();
  });

  // Skip tests if Redis is not available
  const itIfRedis = process.env.SKIP_REDIS_TESTS ? it.skip : it;

  itIfRedis('should handle large datasets', async () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      data: `test${i}`
    }));

    await Promise.all(
      items.map(item => cacheService.set(`key:${item.id}`, item))
    );

    const keys = items.map(item => `key:${item.id}`);
    const results = await Promise.all(
      keys.map(key => cacheService.get(key))
    );

    expect(results).toHaveLength(items.length);
    results.forEach((result, i) => {
      expect(result).toEqual(items[i]);
    });
  }, REDIS_TIMEOUT);

  itIfRedis('should handle TTL correctly', async () => {
    await cacheService.set('ttl-test', 'data', 1);
    expect(await cacheService.get('ttl-test')).toBe('data');
    
    await new Promise(resolve => setTimeout(resolve, 1100));
    expect(await cacheService.get('ttl-test')).toBeNull();
  }, REDIS_TIMEOUT);
});
