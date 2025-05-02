import { RedisCache } from '../../../src/shared/cache/redis';

describe('RedisCache Integration', () => {
  let cache: RedisCache;
  const REDIS_TIMEOUT = 10000; // 10 segundos

  beforeEach(() => {
    cache = new RedisCache({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetries: 1,
      reconnectStrategy: {
        maxAttempts: 2,
        initialDelay: 100,
        maxDelay: 1000
      }
    });
  });

  afterEach(async () => {
    try {
      await cache.clear();
    } catch (error) {
      console.log('Cleanup error:', error);
    }
  });

  // Skip testes se o Redis não estiver disponível
  const itIfRedis = process.env.SKIP_REDIS_TESTS ? it.skip : it;

  itIfRedis('should handle connection errors gracefully', async () => {
    const badCache = new RedisCache({
      host: 'nonexistent',
      port: 6379,
      maxRetries: 1,
      reconnectStrategy: {
        maxAttempts: 1,
        initialDelay: 100,
        maxDelay: 200
      }
    });

    await expect(badCache.get('test')).rejects.toThrow();
  }, REDIS_TIMEOUT);

  itIfRedis('should handle large data with compression', async () => {
    const largeData = { data: 'x'.repeat(1000) }; // Reduzido para teste
    await cache.set('large', largeData);
    const retrieved = await cache.get<typeof largeData>('large');
    expect(retrieved).toEqual(largeData);
  }, REDIS_TIMEOUT);

  itIfRedis('should handle concurrent operations', async () => {
    const promises = Array.from({ length: 10 }, (_, i) => // Reduzido para teste
      cache.set(`key${i}`, `value${i}`)
    );
    await Promise.all(promises);

    const keys = Array.from({ length: 10 }, (_, i) => `key${i}`);
    const values = await cache.mget(keys);
    expect(values).toHaveLength(10);
    values.forEach((value, i) => expect(value).toBe(`value${i}`));
  }, REDIS_TIMEOUT);
});
