import { CacheConfig } from '../types/config';
import { CACHE } from '../constants/constants';

export const defaultCacheConfig: CacheConfig = {
    enabled: true,
    provider: 'memory',
    ttl: CACHE.DEFAULT_TTL,
    maxRetries: CACHE.RETRY.MAX_ATTEMPTS,
    retryDelay: CACHE.RETRY.BASE_DELAY
};

export function validateCacheConfig(config: Partial<CacheConfig>): CacheConfig {
    return {
        ...defaultCacheConfig,
        ...config,
        ttl: Math.min(
            Math.max(config.ttl || CACHE.DEFAULT_TTL, CACHE.MIN_TTL),
            CACHE.MAX_TTL
        )
    };
}
