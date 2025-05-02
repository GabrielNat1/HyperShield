# Troubleshooting Guide

## Common Issues

### Cache Not Working

#### Symptoms
- Cache misses when hits expected
- Increased response times
- Higher than expected Redis/Memory usage

#### Solutions

```typescript
// Enable debug logging
const shield = new HyperShield({
  logging: {
    level: 'debug',
    cache: true
  }
});

// Verify cache status
const status = await shield.cache.getStatus();
console.log(status);

// Test cache manually
await shield.cache.set('test', 'value');
const value = await shield.cache.get('test');
```

### High Memory Usage

#### Symptoms
- Increasing memory consumption
- Slow response times
- Out of memory errors

#### Solutions

```typescript
// Monitor memory usage
shield.metrics.on('memory', (usage) => {
  if (usage.heapUsed > 0.8 * usage.heapTotal) {
    shield.cache.prune();
  }
});

// Implement size limits
shield.cache({
  maxSize: '500mb',
  maxEntrySize: '1mb',
  pruneInterval: 60000
});
```

### Compression Issues

#### Symptoms
- Large response sizes
- High CPU usage
- Slow response times

#### Solutions

```typescript
// Debug compression
shield.compression({
  debug: true,
  onCompress: (info) => {
    console.log(`Compressed ${info.originalSize} to ${info.compressedSize}`);
  }
});

// Optimize compression
shield.compression({
  threshold: 1024,
  filter: (req) => {
    return /json|text|javascript/.test(req.headers['content-type']);
  }
});
```

## Diagnostics

### Health Checks

```typescript
// Add comprehensive health checks
shield.health.add('cache', async () => {
  const start = Date.now();
  try {
    await shield.cache.ping();
    return {
      status: 'ok',
      latency: Date.now() - start
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
});

// Get health status
app.get('/health', async (req, res) => {
  const health = await shield.health.check();
  res.json(health);
});
```

### Performance Analysis

```typescript
// Enable detailed metrics
shield.metrics.enableDetailed({
  intervals: ['1m', '5m', '15m'],
  percentiles: [0.5, 0.9, 0.95, 0.99],
  breakdowns: {
    byRoute: true,
    byMethod: true,
    byStatusCode: true
  }
});

// Analyze performance
shield.analysis.run({
  duration: '1h',
  samples: 1000,
  output: './analysis.json'
});
```

## Emergency Actions

### Cache Recovery

```typescript
// Clear problematic cache entries
await shield.cache.clearPattern('problematic:*');

// Switch to fallback cache
shield.useFailover({
  provider: 'memory',
  ttl: 300 // 5 minutes
});
```

### Performance Recovery

```typescript
// Temporary relief measures
shield.emergency({
  // Disable non-critical features
  compression: false,
  monitoring: 'minimal',
  // Increase timeouts
  timeouts: {
    cache: 1000,
    compression: 500
  },
  // Enable circuit breakers
  circuitBreaker: {
    failureThreshold: 50,
    resetTimeout: 30000
  }
});
```
