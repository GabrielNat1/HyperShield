import { HyperShieldConfig } from './core/types/config';
import { EventBus } from './core/events/eventBus';
import { CacheManager } from './domains/cache/cacheManager';

export class HyperShield {
    private config: HyperShieldConfig;
    private eventBus: EventBus;
    private cacheManager: CacheManager;

    constructor(config: HyperShieldConfig) {
        this.config = config;
        this.eventBus = new EventBus();
        this.cacheManager = new CacheManager(config.cache);
    }

    public initialize(): void {
        // Initialize components based on config
        if (this.config.cache.enabled) {
            this.cacheManager.initialize();
        }
    }
}

export * from './core/types/config';
export * from './domains/cache/cacheManager';
export * from './core/events/eventBus';
