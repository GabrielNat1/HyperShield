import express from 'express';
import request from 'supertest';
import { HyperShield } from '../../src';
import { compressionMiddleware } from '../../src/adapters/express/middleware/compressionMiddleware';
import { cacheMiddleware } from '../../src/adapters/express/middleware/cacheMiddleware';

describe('Middleware Integration', () => {
  let app: express.Application;
  let shield: HyperShield;

  beforeEach(() => {
    app = express();
    shield = new HyperShield({
      cache: {
        enabled: true,
        provider: 'memory',
        ttl: 3600
      }
    });
    shield.initialize();
  });

  it('should properly chain middlewares', async () => {
    let handlerCalls = 0;
    
    app.use(compressionMiddleware());
    app.use(cacheMiddleware(shield.getCacheManager()));

    app.get('/test', (_, res) => {
      handlerCalls++;
      res.json({ data: 'x'.repeat(1000) });
    });

    // First request - should compress and cache
    const res1 = await request(app)
      .get('/test')
      .set('Accept-Encoding', 'gzip');
    
    expect(res1.headers['content-encoding']).toBe('gzip');
    expect(handlerCalls).toBe(1);

    // Second request - should use cache and compress
    const res2 = await request(app)
      .get('/test')
      .set('Accept-Encoding', 'gzip');
    
    expect(res2.headers['content-encoding']).toBe('gzip');
    expect(handlerCalls).toBe(1); // Still 1 due to caching
  });

  it('should handle errors gracefully', async () => {
    app.use(compressionMiddleware());
    app.use(cacheMiddleware(shield.getCacheManager()));

    app.get('/error', (_, res) => {
      res.status(500).json({ error: 'test error' });
    });

    const response = await request(app)
      .get('/error')
      .set('Accept-Encoding', 'gzip');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'test error' });
  });

  it('should handle different content types', async () => {
    app.use(compressionMiddleware());
    app.use(cacheMiddleware(shield.getCacheManager()));

    app.get('/text', (_, res) => {
      res.set('Content-Type', 'text/plain');
      res.send('Hello World'.repeat(100));
    });

    app.get('/json', (_, res) => {
      res.json({ data: 'x'.repeat(1000) });
    });

    const textRes = await request(app)
      .get('/text')
      .set('Accept-Encoding', 'gzip');
    
    expect(textRes.headers['content-encoding']).toBe('gzip');
    expect(textRes.headers['content-type']).toContain('text/plain');

    const jsonRes = await request(app)
      .get('/json')
      .set('Accept-Encoding', 'gzip');
    
    expect(jsonRes.headers['content-encoding']).toBe('gzip');
    expect(jsonRes.headers['content-type']).toContain('application/json');
  });
});