import { CacheConfig } from '../../core/types/config';
import { CACHE } from '../../core/constants/constants';
import { ICacheProvider } from './domain/ICacheProvider';
import { MemoryCache } from '../../shared/cache/memory';
import { RedisCache } from '../../shared/cache/redis';

export class CacheManager {
    private config: CacheConfig;
    private provider?: ICacheProvider;

    constructor(config: CacheConfig) {
        this.config = config;
    }

    public initialize(): void {
        this.provider = this.createProvider();
    }

    private createProvider(): ICacheProvider {
        switch (this.config.provider) {
            case 'redis':
                if (!this.config.connection?.host) {
                    throw new Error('Redis host is required');
                }
                return new RedisCache({
                    host: this.config.connection.host,
                    port: this.config.connection.port ?? 6379,
                    password: this.config.connection.password
                });

            case 'memory':
                return new MemoryCache();

            default:
                throw new Error(`Unsupported cache provider: ${this.config.provider}`);
        }
    }

    private ensureInitialized() {
        if (!this.provider) {
            throw new Error('Cache manager not initialized. Call initialize() first.');
        }
    }

    async get<T>(key: string): Promise<T | null> {
        this.ensureInitialized();
        return this.provider!.get<T>(key);
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        this.ensureInitialized();
        const validTtl = Math.min(
            Math.max(ttl || CACHE.DEFAULT_TTL, CACHE.MIN_TTL),
            CACHE.MAX_TTL
        );
        await this.provider!.set(key, value, validTtl);
    }

    async delete(key: string): Promise<void> {
        this.ensureInitialized();
        await this.provider!.delete(key);
    }
}
