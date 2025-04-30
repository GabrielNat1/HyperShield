export interface CacheConfig {
    enabled: boolean;
    provider: 'redis' | 'memcached' | 'memory';
    ttl: number;
    connection?: {
        host: string;
        port: number;
        password?: string;
    };
    maxRetries?: number;
    retryDelay?: number;
}

export interface CompressionConfig {
    enabled: boolean;
    type: 'gzip' | 'brotli' | 'deflate';
    level?: number;
    threshold?: number; // tamanho mínimo para comprimir
}

export interface HyperShieldConfig {
    cache: CacheConfig;
    compression?: CompressionConfig;
    alerts?: {
        enabled: boolean;
        providers: ('email' | 'webhook' | 'websocket')[];
    };
    logging?: {
        level: 'debug' | 'info' | 'warn' | 'error';
        format?: 'json' | 'text';
    };
}
