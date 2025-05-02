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
            const result = await this.provider.get<T>(key);
            return result === undefined ? null : result;
        } catch (error) {
            console.error(`Cache get error: ${error}`);
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        try {
            if (value === undefined || value === null) {
                return;
            }
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

    async has(key: string): Promise<boolean> {
        try {
            const value = await this.get(key);
            return value !== null;
        } catch (error) {
            console.error(`Cache check error: ${error}`);
            return false;
        }
    }

    async getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached !== null) {
            return cached;
        }

        const value = await factory();
        await this.set(key, value, ttl);
        return value;
    }

    async mget<T>(keys: string[]): Promise<(T | null)[]> {
        return Promise.all(keys.map(key => this.get<T>(key)));
    }

    async mset(entries: { key: string; value: any; ttl?: number }[]): Promise<void> {
        await Promise.all(
            entries.map(entry => this.set(entry.key, entry.value, entry.ttl))
        );
    }
}
