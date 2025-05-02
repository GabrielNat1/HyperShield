import { CacheFactory } from '../../../src/services/factories/cacheFactory';

describe('CacheFactory', () => {
  beforeEach(() => {
    CacheFactory.clearInstance();
  });

  it('should create memory cache service', () => {
    const service = CacheFactory.createCacheService({
      enabled: true,
      provider: 'memory',
      ttl: 3600
    });

    expect(service).toBeDefined();
  });

  it('should reuse existing instance', () => {
    const service1 = CacheFactory.createCacheService({
      enabled: true,
      provider: 'memory',
      ttl: 3600
    });

    const service2 = CacheFactory.createCacheService({
      enabled: true,
      provider: 'memory',
      ttl: 1800
    });

    expect(service1).toBe(service2);
  });

  it('should throw error when getting instance before initialization', () => {
    expect(() => CacheFactory.getInstance()).toThrow();
  });

  it('should validate cache config', () => {
    expect(() => CacheFactory.createCacheService({
      enabled: true,
      provider: 'invalid' as any,
      ttl: 3600
    })).toThrow();
  });
});
