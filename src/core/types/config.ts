export interface CacheConfig {
    enabled: boolean;
    provider: 'redis' | 'memcached' | 'memory';
    ttl: number;
    connection?: {
        host: string;
        port: number;
        password?: string;
    };
}

export interface HyperShieldConfig {
    cache: CacheConfig;
    compression?: {
        enabled: boolean;
        level?: number;
    };
    alerts?: {
        enabled: boolean;
        providers: ('email' | 'webhook' | 'websocket')[];
    };
}
