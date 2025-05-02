export interface BaseCacheOptions {
    ttl?: number;
    compression?: boolean;
    maxSize?: number; // in bytes
}

export interface RedisCacheOptions extends BaseCacheOptions {
    host: string;
    port: number;
    password?: string;
    maxRetries?: number;
    retryDelay?: number;
    db?: number;
    tls?: boolean;
    reconnectStrategy?: {
        maxAttempts: number;
        initialDelay: number;
        maxDelay: number;
    };
}

export interface MemoryCacheOptions extends BaseCacheOptions {
    maxItems?: number;
    maxMemorySize?: number; // in bytes
    pruneInterval?: number; // in ms
}

export interface CacheEntry<T> {
    value: T;
    size: number;
    compressed?: boolean;
    expiresAt?: number;
    lastAccessed: number;
}
