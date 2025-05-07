import { HyperShieldConfig, CacheConfig, CompressionConfig, MetricsConfig } from '../types/config';

export class ConfigValidator {
    static validate(config: Partial<HyperShieldConfig>): HyperShieldConfig {
        return {
            cache: this.validateCacheConfig(config.cache),
            compression: this.validateCompressionConfig(config.compression),
            metrics: this.validateMetricsConfig(config.metrics)
        };
    }

    private static validateCacheConfig(config?: Partial<CacheConfig>): CacheConfig {
        return {
            enabled: config?.enabled ?? false,
            provider: config?.provider ?? 'memory',
            ttl: config?.ttl ?? 3600,
            connection: {
                host: config?.connection?.host ?? 'localhost',
                port: config?.connection?.port ?? 6379,
                password: config?.connection?.password
            },
            maxRetries: config?.maxRetries ?? 3,
            retryDelay: config?.retryDelay ?? 1000
        };
    }

    private static validateCompressionConfig(config?: Partial<CompressionConfig>): CompressionConfig {
        return {
            enabled: config?.enabled ?? true,
            type: config?.type ?? 'gzip',
            level: config?.level ?? 6,
            threshold: config?.threshold ?? 1024
        };
    }

    private static validateMetricsConfig(config?: Partial<MetricsConfig>): MetricsConfig {
        return {
            enabled: config?.enabled ?? false,
            path: config?.path ?? '/metrics',
            prefix: config?.prefix ?? 'hypershield_',
            collectDefaultMetrics: config?.collectDefaultMetrics ?? true,
            defaultLabels: config?.defaultLabels ?? {}
        };
    }
}
