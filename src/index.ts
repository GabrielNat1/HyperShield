import { HyperShieldConfig } from './core/types/config';
import { EventBus } from './core/events/eventBus';
import { CacheManager } from './domains/cache/cacheManager';
import { RequestHandler } from 'express';

export type HyperShieldEvent = {
    type: 'cache:hit' | 'cache:miss' | 'cache:set' | 'cache:error';
    key?: string;
    error?: Error;
    timestamp: number;
};

export class HyperShield {
    private config: HyperShieldConfig;
    private eventBus: EventBus;
    private cacheManager: CacheManager;
    private initialized: boolean = false;

    constructor(config: HyperShieldConfig) {
        this.config = config;
        this.eventBus = new EventBus();
        this.cacheManager = new CacheManager(config.cache || { enabled: false, ttl: 3600 });
    }

    public initialize(): void {
        if (this.initialized) {
            return;
        }
        // Initialize components based on config
        if (this.config.cache?.enabled) {
            this.cacheManager.initialize();
        }
        this.initialized = true;
    }

    public onEvent(event: string, handler: (data: HyperShieldEvent) => void): void {
        this.eventBus.subscribe(event, handler);
    }

    public async getFromCache<T>(key: string): Promise<T | null> {
        try {
            const result = await this.cacheManager.get<T>(key);
            this.eventBus.publish('cache:' + (result ? 'hit' : 'miss'), {
                type: result ? 'cache:hit' : 'cache:miss',
                key,
                timestamp: Date.now()
            });
            return result;
        } catch (error) {
            this.eventBus.publish('cache:error', {
                type: 'cache:error',
                key,
                error: error as Error,
                timestamp: Date.now()
            });
            return null;
        }
    }

    public getCacheManager(): CacheManager {
        if (!this.cacheManager) {
            throw new Error('Cache manager not initialized. Call initialize() first.');
        }
        return this.cacheManager;
    }

    public compression(_options?: { level?: number; threshold?: number }): RequestHandler {
        if (!this.initialized) {
            throw new Error('HyperShield must be initialized before using compression');
        }
        return (_req, _res, next) => {
            // Compression middleware logic will be implemented here
            next();
        };
    }

    public cache(_options?: { ttl?: number }): RequestHandler {
        if (!this.initialized) {
            throw new Error('HyperShield must be initialized before using cache');
        }
        return (_req, _res, next) => {
            // Cache middleware logic will be implemented here
            next();
        };
    }

    public metrics(_options?: { path?: string }): RequestHandler {
        if (!this.initialized) {
            throw new Error('HyperShield must be initialized before using metrics');
        }
        return (_req, _res, next) => {
            // Metrics middleware logic will be implemented here
            next();
        };
    }
}

export * from './core/types/config';
export * from './domains/cache/cacheManager';
export * from './core/events/eventBus';
