import express from 'express';
import request from 'supertest';
import { HyperShield } from '../../src';
import { compressionMiddleware } from '../../src/adapters/express/middleware/compressionMiddleware';
import { cacheMiddleware } from '../../src/adapters/express/middleware/cacheMiddleware';

describe('Express Integration', () => {
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

  it('should compress responses', async () => {
    app.use(compressionMiddleware());
    app.get('/test', (_, res) => {
      res.send('x'.repeat(1000));
    });

    const response = await request(app)
      .get('/test')
      .set('Accept-Encoding', 'gzip');

    expect(response.headers['content-encoding']).toBe('gzip');
    expect(response.statusCode).toBe(200);
  });

  it('should cache responses', async () => {
    const mockData = { data: 'test' };
    let callCount = 0;

    app.get('/cached', cacheMiddleware(shield.getCacheManager()), (_, res) => {
      callCount++;
      res.json(mockData);
    });

    // First call
    await request(app).get('/cached');
    // Second call (should be cached)
    await request(app).get('/cached');

    expect(callCount).toBe(1); // Handler called only once
  });
});
