import { HyperShieldConfig, CacheConfig, CompressionConfig } from '../types/config';
import { CACHE, COMPRESSION } from '../constants/constants';

export class ConfigValidator {
  static validate(config: Partial<HyperShieldConfig>): HyperShieldConfig {
    return {
      cache: this.validateCacheConfig(config.cache || {}),
      compression: this.validateCompressionConfig(config.compression || {}),
      alerts: this.validateAlertConfig(config.alerts || { enabled: false, providers: [] })
    };
  }

  private static validateCacheConfig(config: Partial<CacheConfig>): CacheConfig {
    if (config.ttl) {
      config.ttl = Math.min(Math.max(config.ttl, CACHE.MIN_TTL), CACHE.MAX_TTL);
    }
    
    return {
      enabled: config.enabled ?? true,
      provider: config.provider || 'memory',
      ttl: config.ttl || CACHE.DEFAULT_TTL,
      maxRetries: config.maxRetries || CACHE.RETRY.MAX_ATTEMPTS,
      retryDelay: config.retryDelay || CACHE.RETRY.BASE_DELAY
    };
  }

  private static validateCompressionConfig(config: Partial<CompressionConfig>): CompressionConfig {
    return {
      enabled: config.enabled ?? true,
      type: config.type || 'gzip',
      level: Math.min(Math.max(config.level || COMPRESSION.GZIP.DEFAULT_LEVEL, 
        COMPRESSION.GZIP.MIN_LEVEL), COMPRESSION.GZIP.MAX_LEVEL),
      threshold: config.threshold || COMPRESSION.GZIP.MIN_SIZE_TO_COMPRESS
    };
  }

  private static validateAlertConfig(config: any) {
    return {
      enabled: config.enabled ?? false,
      providers: Array.isArray(config.providers) ? config.providers : []
    };
  }
}
