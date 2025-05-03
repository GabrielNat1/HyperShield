# Caching Examples

## Basic Caching

```typescript
import { HyperShield } from 'hypershield';
import express from 'express';

// Memory Cache
const shield = new HyperShield({
  cache: {
    enabled: true,
    provider: 'memory',
    ttl: 3600
  }
});

shield.initialize();

// Cache middleware
app.get('/api/data', shield.cache(), (req, res) => {
  res.json({ data: 'Cached response' });
});

// Manual cache operations
await shield.getCacheManager().set('key', 'value', 3600);
const value = await shield.getCacheManager().get('key');
```

## Redis Cache

```typescript
const shield = new HyperShield({
  cache: {
    enabled: true,
    provider: 'redis',
    ttl: 3600,
    connection: {
      host: 'localhost',
      port: 6379,
      password: 'optional'
    }
  }
});

// Cache with compression
app.get('/api/large-data', 
  shield.cache({ compression: true }), 
  (req, res) => {
    res.json(largeData);
  }
);

// Cache with custom TTL
app.get('/api/short-lived', 
  shield.cache({ ttl: 60 }), // 1 minute
  (req, res) => {
    res.json(data);
  }
);
```

## Advanced Caching

```typescript
// Pattern-based caching
shield.cache.setPattern('user:*', async (key) => {
  const userId = key.split(':')[1];
  return await getUserData(userId);
}, { ttl: 3600 });

// Batch operations
await shield.cache.mset([
  { key: 'key1', value: 'value1' },
  { key: 'key2', value: 'value2' }
]);

// Cache with stale-while-revalidate
app.get('/api/data', 
  shield.cache({
    ttl: 3600,
    staleWhileRevalidate: true,
    revalidateAfter: 1800
  }),
  (req, res) => {
    res.json(data);
  }
);
```
