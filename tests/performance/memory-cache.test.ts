import { MemoryCache } from '../../src/shared/cache/memory';

describe('Memory Cache Performance', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache({
      maxItems: 10000,
      maxMemorySize: 50 * 1024 * 1024 // 50MB
    });
  });

  afterEach(() => {
    cache.cleanup();
  });

  it('should handle high concurrency', async () => {
    const iterations = 1000;
    const startTime = Date.now();

    const promises = Array.from({ length: iterations }, (_, i) => 
      Promise.all([
        cache.set(`key-${i}`, `value-${i}`),
        cache.get(`key-${i}`),
        cache.exists(`key-${i}`)
      ])
    );

    await Promise.all(promises);
    const duration = Date.now() - startTime;
    
    console.log(`Completed ${iterations * 3} operations in ${duration}ms`);
    expect(duration).toBeLessThan(5000); // Should complete within 5s
  });

  it('should handle large datasets efficiently', async () => {
    const items = 5000;
    const dataSize = 1024; // 1KB per item
    
    console.time('bulk-insert');
    for (let i = 0; i < items; i++) {
      await cache.set(`key-${i}`, 'x'.repeat(dataSize));
    }
    console.timeEnd('bulk-insert');

    // Test random access
    const startTime = Date.now();
    for (let i = 0; i < 100; i++) {
      const randomKey = `key-${Math.floor(Math.random() * items)}`;
      await cache.get(randomKey);
    }
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(1000); // Random access should be fast
  });

  it('should handle memory limits correctly', async () => {
    const cache = new MemoryCache({
      maxMemorySize: 1024 * 1024 // 1MB
    });

    // Try to exceed memory limit
    const data = 'x'.repeat(512 * 1024); // 512KB
    await cache.set('key1', data);
    await cache.set('key2', data);
    await cache.set('key3', data); // Should trigger pruning

    // Only newest items should remain
    const allExist = await Promise.all([
      cache.exists('key1'),
      cache.exists('key2'),
      cache.exists('key3'),
    ]);

    expect(allExist).toContain(false); // At least one key should be pruned
  });
});
