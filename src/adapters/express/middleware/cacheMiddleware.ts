import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../../../domains/cache/application/cacheService';
import { CACHE } from '../../../core/constants/constants';

export interface CacheMiddlewareOptions {
    ttl?: number;
    keyPrefix?: string;
    ignoreQueryParams?: boolean;
}

export const cacheMiddleware = (cacheService: CacheService, options: CacheMiddlewareOptions = {}) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET') {
            return next();
        }

        const cacheKey = generateCacheKey(req, options);
        try {
            const cachedResponse = await cacheService.get<any>(cacheKey);
            
            if (cachedResponse) {
                return res.json(cachedResponse);
            }

            // Capture the response
            const originalJson = res.json;
            res.json = function(body: any) {
                cacheService.set(cacheKey, body, options.ttl || CACHE.DEFAULT_TTL)
                    .catch(err => console.error('Cache set error:', err));
                return originalJson.call(this, body);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

function generateCacheKey(req: Request, options: CacheMiddlewareOptions): string {
    const prefix = options.keyPrefix || 'cache';
    const path = req.path;
    const query = options.ignoreQueryParams ? '' : JSON.stringify(req.query);
    
    return `${prefix}:${path}${query ? `:${query}` : ''}`;
}
