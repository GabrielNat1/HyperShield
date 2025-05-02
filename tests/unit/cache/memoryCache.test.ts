import { MemoryCache } from '../../../src/shared/cache/memory';

describe('MemoryCache', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache();
  });

  afterEach(() => {
    cache.cleanup();
  });

  it('should store and retrieve values', async () => {
    await cache.set('test', { data: 'value' });
    const result = await cache.get('test');
    expect(result).toEqual({ data: 'value' });
  });

  it('should respect TTL', async () => {
    await cache.set('test', 'value', 1); // 1 second TTL
    expect(await cache.get('test')).toBe('value');
    
    await new Promise(resolve => setTimeout(resolve, 1100));
    expect(await cache.get('test')).toBeNull();
  });

  it('should handle multiple operations', async () => {
    await Promise.all([
      cache.set('key1', 'value1'),
      cache.set('key2', 'value2')
    ]);

    const results = await cache.mget(['key1', 'key2', 'nonexistent']);
    expect(results).toEqual(['value1', 'value2', null]);
  });

  it('should delete keys', async () => {
    await cache.set('test', 'value');
    await cache.delete('test');
    expect(await cache.get('test')).toBeNull();
  });
});
