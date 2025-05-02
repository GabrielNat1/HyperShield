# Advanced Usage Guide

## Combining Multiple Features

### Rate Limiting with Caching and Compression

```typescript
import { HyperShield } from 'hypershield';
import express from 'express';

const app = express();
const shield = new HyperShield({
  cache: {
    enabled: true,
    provider: 'redis',
    ttl: 3600,
    connection: {
      host: 'localhost',
      port: 6379
    }
  },
  compression: {
    enabled: true,
    type: 'gzip',
    level: 6,
    threshold: 1024
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    message: 'Too many requests'
  }
});

// Apply middleware chain
app.use(shield.rateLimit());
app.use(shield.compression());

// Route with all features
app.get('/api/products', 
  shield.cache({ ttl: 1800 }),
  async (req, res) => {
    const products = await getProducts();
    res.json(products);
  }
);
```

## Clustering Support

### Redis Cache with Multiple Nodes

```typescript
const shield = new HyperShield({
  cache: {
    enabled: true,
    provider: 'redis',
    ttl: 3600,
    connection: {
      nodes: [
        { host: 'redis-1', port: 6379 },
        { host: 'redis-2', port: 6379 },
        { host: 'redis-3', port: 6379 }
      ],
      options: {
        maxRetries: 3,
        retryDelay: 1000
      }
    }
  }
});
```

## Custom Error Handling

```typescript
shield.onError((error, req, res) => {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: error.retryAfter
    });
  } else if (error.code === 'CACHE_ERROR') {
    // Fallback to database
    return getDatabaseData(req.params.id);
  }
});
```

## Metrics and Monitoring

### Custom Metrics

```typescript
const metrics = shield.metrics();

// Custom counter
metrics.createCounter('business_logic_errors', 'Business logic error count', ['type']);

// Record values
metrics.incrementCounter('business_logic_errors', { type: 'validation' });

// Custom histogram
metrics.createHistogram('payment_processing_time', 'Payment processing duration');
metrics.recordDuration('payment_processing_time', 234);
```

### Prometheus Integration

```typescript
app.get('/metrics', async (req, res) => {
  const metrics = await shield.getMetrics();
  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});
```

## Circuit Breaking

```typescript
shield.addCircuitBreaker('database', {
  failureThreshold: 5,
  resetTimeout: 30000,
  onOpen: () => notifyDevOps('Database circuit opened'),
  onClose: () => notifyDevOps('Database circuit closed')
});

// Use in routes
app.get('/api/data', shield.withCircuitBreaker('database'), async (req, res) => {
  const data = await getDatabaseData();
  res.json(data);
});
```

## Advanced Caching Strategies

### Cache with Stale-While-Revalidate

```typescript
app.get('/api/products', shield.cache({
  ttl: 3600,
  staleWhileRevalidate: true,
  revalidateAfter: 1800,
  onRevalidate: async (key, oldValue) => {
    const newValue = await fetchFreshData();
    await shield.cache.set(key, newValue);
  }
}));
```

### Cache with Patterns and Wildcards

```typescript
// Cache with patterns
shield.cache.setPattern('user:*', async (key) => {
  const userId = key.split(':')[1];
  return await getUserData(userId);
}, { ttl: 3600 });

// Invalidate by pattern
shield.cache.invalidatePattern('user:*');
```

## Complex Caching Strategies

### Cache with Compression

```typescript
const shield = new HyperShield({
  cache: {
    enabled: true,
    provider: 'redis',
    compression: true,
    ttl: 3600
  }
});

// Cache large responses with compression
app.get('/api/data', shield.cache({ compress: true }), (req, res) => {
  const largeData = generateLargeData();
  res.json(largeData);
});
```

### Pattern-based Cache Invalidation

```typescript
// Cache with tags
app.get('/api/products', 
  shield.cache({ 
    tags: ['products'],
    ttl: 3600 
  }), 
  (req, res) => {
    res.json(products);
  }
);

// Invalidate specific patterns
await shield.cache.invalidateByTags(['products']);
```

## Advanced Compression

### Content-Type Based Compression

```typescript
app.use(shield.compression({
  filter: (req, res) => {
    return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
  },
  level: 6,
  threshold: 1024
}));
```

### Dynamic Compression Levels

```typescript
app.use(shield.compression({
  dynamicLevel: true,
  levelProvider: (req, res) => {
    const userAgent = req.headers['user-agent'];
    if (userAgent?.includes('Mobile')) {
      return 9; // Maximum compression for mobile
    }
    return 6; // Default level
  }
}));
```

## Metrics and Monitoring

### Custom Metrics

```typescript
const metrics = shield.metrics;

// Create custom counter
metrics.createCounter('business_transactions_total', 
  'Total number of business transactions', 
  ['type', 'status']
);

// Record metrics
app.post('/api/transaction', (req, res) => {
  metrics.incrementCounter('business_transactions_total', {
    type: req.body.type,
    status: 'success'
  });
  res.json({ success: true });
});
```

### Advanced Alerting

```typescript
const alertService = shield.alerts;

// Configure complex alert conditions
alertService.addRule({
  name: 'high_error_rate',
  condition: (metrics) => {
    const errorRate = metrics.get('error_rate_1m').value;
    const requestRate = metrics.get('request_rate_1m').value;
    return errorRate > 0.05 && requestRate > 100;
  },
  throttle: '5m',
  actions: [
    {
      type: 'webhook',
      url: 'https://alerts.example.com/high-error-rate'
    },
    {
      type: 'email',
      recipients: ['ops@example.com']
    }
  ]
});
```

## High Availability Setup

### Redis Cluster Configuration

```typescript
const shield = new HyperShield({
  cache: {
    enabled: true,
    provider: 'redis',
    cluster: {
      nodes: [
        { host: 'redis-1', port: 6379 },
        { host: 'redis-2', port: 6379 },
        { host: 'redis-3', port: 6379 }
      ],
      options: {
        maxRedirections: 16,
        retryDelayOnFailover: 100
      }
    }
  }
});
```

### Load Balancer Integration

```typescript
shield.on('health', (status) => {
  if (status.healthy) {
    notifyLoadBalancer('ADD');
  } else {
    notifyLoadBalancer('REMOVE');
  }
});

// Custom health checks
shield.addHealthCheck('cache', async () => {
  const healthy = await shield.cache.ping();
  return { healthy, latency: healthy.latency };
});
```

## Performance Tuning

### Memory Cache Configuration

```typescript
const shield = new HyperShield({
  cache: {
    provider: 'memory',
    maxItems: 10000,
    maxSize: '100mb',
    evictionPolicy: 'lru',
    segments: 16, // For concurrent access
    statistics: true
  }
});
```

### Compression Optimization

```typescript
shield.compression({
  level: 6,
  chunkSize: 16 * 1024,
  windowBits: 15,
  memLevel: 8,
  strategy: 'dynamic',
  threshold: (req, data) => {
    if (req.headers['save-bandwidth']) {
      return 100; // Compress almost everything
    }
    return 1024; // Default threshold
  }
});
```
