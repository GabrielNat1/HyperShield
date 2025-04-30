import { ICacheProvider } from '../../domains/cache/domain/ICacheProvider';

interface CacheEntry<T> {
    value: T;
    expiresAt?: number;
}

export class MemoryCache implements ICacheProvider {
    private cache: Map<string, CacheEntry<any>> = new Map();

    async get<T>(key: string): Promise<T | null> {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (entry.expiresAt && entry.expiresAt < Date.now()) {
            this.cache.delete(key);
            return null;
        }

        return entry.value;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const entry: CacheEntry<T> = {
            value,
            expiresAt: ttl ? Date.now() + ttl * 1000 : undefined
        };
        this.cache.set(key, entry);
    }

    async delete(key: string): Promise<void> {
        this.cache.delete(key);
    }

    async clear(): Promise<void> {
        this.cache.clear();
    }
}
