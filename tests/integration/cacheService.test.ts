import { CacheService } from '../../src/domains/cache/application/cacheService';
import { CacheConfig } from '../../src/core/types/config';

describe('CacheService Integration', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    const config: CacheConfig = {
      enabled: true,
      provider: 'memory',
      ttl: 3600
    };
    cacheService = new CacheService(config);
  });

  it('should handle complex data types', async () => {
    const testData = {
      string: 'test',
      number: 123,
      boolean: true,
      array: [1, 2, 3],
      object: { nested: 'value' }
    };

    await cacheService.set('complex', testData);
    const retrieved = await cacheService.get('complex');
    expect(retrieved).toEqual(testData);
  });

  it('should handle concurrent operations', async () => {
    const operations = Array.from({ length: 100 }, (_, i) => 
      cacheService.set(`key${i}`, `value${i}`)
    );

    await Promise.all(operations);
    
    const keys = Array.from({ length: 100 }, (_, i) => `key${i}`);
    const values = await Promise.all(keys.map(k => cacheService.get(k)));
    
    values.forEach((value, i) => {
      expect(value).toBe(`value${i}`);
    });
  });
});
