import { ICacheProvider } from '../domain/ICacheProvider';
import { CACHE } from '../../../core/constants/constants';
import { RedisCache } from '../../../shared/cache/redis';
import { MemoryCache } from '../../../shared/cache/memory';
import { CacheConfig } from '../../../core/types/config';

export class CacheService {
    private provider: ICacheProvider;
    private config: CacheConfig;

    constructor(config: CacheConfig) {
        this.config = config;
        this.provider = this.initializeProvider();
    }

    private initializeProvider(): ICacheProvider {
        if (!this.config.enabled) {
            throw new Error('Cache is not enabled in configuration');
        }

        switch (this.config.provider) {
            case 'memory':
                return new MemoryCache();
            case 'redis':
                if (!this.config.connection) {
                    throw new Error('Redis connection configuration is required');
                }
                return new RedisCache(this.config.connection);
            default:
                throw new Error(`Unsupported cache provider: ${this.config.provider}`);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            return await this.provider.get<T>(key);
        } catch (error) {
            console.error(`Cache get error: ${error}`);
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        try {
            const validTtl = ttl ?? this.config.ttl ?? CACHE.DEFAULT_TTL;
            await this.provider.set(key, value, validTtl);
        } catch (error) {
            console.error(`Cache set error: ${error}`);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.provider.delete(key);
        } catch (error) {
            console.error(`Cache delete error: ${error}`);
        }
    }

    async clear(): Promise<void> {
        try {
            await this.provider.clear();
        } catch (error) {
            console.error(`Cache clear error: ${error}`);
        }
    }
}
