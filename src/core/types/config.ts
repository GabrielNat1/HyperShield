export interface CacheConfig {
    enabled?: boolean;
    provider?: 'redis' | 'memcached' | 'memory';
    ttl?: number;
    connection?: {
        host?: string;
        port?: number;
        password?: string;
    };
    maxRetries?: number;
    retryDelay?: number;
}

export interface CompressionConfig {
    enabled?: boolean;
    type?: 'gzip' | 'brotli' | 'deflate';
    level?: number;
    threshold?: number;
}

export interface MetricsConfig {
    enabled?: boolean;
    path?: string;
    prefix?: string;
    defaultLabels?: Record<string, string>;
    collectDefaultMetrics?: boolean;
}

export interface HyperShieldConfig {
    cache?: Partial<CacheConfig>;
    compression?: Partial<CompressionConfig>;
    metrics?: Partial<MetricsConfig>;
}
