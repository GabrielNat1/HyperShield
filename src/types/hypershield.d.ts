import { RequestHandler } from 'express';

declare module 'hypershield' {
  export class HyperShield {
    constructor(options?: {
      cache?: {
        enabled?: boolean;
        provider?: 'redis' | 'memory';
        ttl?: number;
        connection?: {
          host: string;
          port: number;
          password?: string;
        };
      };
      compression?: {
        enabled?: boolean;
        level?: number;
        threshold?: number;
      };
      metrics?: {
        enabled?: boolean;
        path?: string;
      };
    });

    compression(): RequestHandler;
    cache(options?: { ttl?: number }): RequestHandler;
    metrics(): RequestHandler;
  }
}
