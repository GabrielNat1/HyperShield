import { CacheConfig } from '../../core/types/config';
import { ICacheProvider } from './domain/ICacheProvider';
import { MemoryCache } from '../../shared/cache/memory';
import { RedisCache } from '../../shared/cache/redis';

export class CacheManager {
    private config: CacheConfig;
    private provider: ICacheProvider;

    constructor(config: CacheConfig) {
        this.config = config;
        this.provider = this.createProvider();
    }

    private createProvider(): ICacheProvider {
        switch (this.config.provider) {
            case 'redis':
                if (!this.config.connection) {
                    throw new Error('Redis connection config is required');
                }
                return new RedisCache(this.config.connection);
            case 'memory':
                return new MemoryCache();
            default:
                throw new Error(`Unsupported cache provider: ${this.config.provider}`);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        return this.provider.get<T>(key);
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        await this.provider.set(key, value, ttl || this.config.ttl);
    }

    async delete(key: string): Promise<void> {
        await this.provider.delete(key);
    }
}
