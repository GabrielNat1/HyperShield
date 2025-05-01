import { CacheService } from '../../domains/cache/application/cacheService';
import { CacheConfig } from '../../core/types/config';
import { validateCacheConfig } from '../../core/config/cache';

export class CacheFactory {
    private static instance: CacheService;

    static createCacheService(config: Partial<CacheConfig>): CacheService {
        if (!this.instance) {
            const validatedConfig = validateCacheConfig(config);
            this.instance = new CacheService(validatedConfig);
        }
        return this.instance;
    }

    static getInstance(): CacheService {
        if (!this.instance) {
            throw new Error('Cache service not initialized. Call createCacheService first.');
        }
        return this.instance;
    }

    static clearInstance(): void {
        this.instance?.clear();
        this.instance = undefined as any;
    }
}
