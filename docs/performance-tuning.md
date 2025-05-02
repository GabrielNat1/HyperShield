# Performance Tuning Guide

## Cache Optimization

### Memory Cache

```typescript
const shield = new HyperShield({
  cache: {
    provider: 'memory',
    maxItems: 10000,
    maxSize: '100mb',
    pruneInterval: 60000,
    segmentation: {
      enabled: true,
      segments: 16 // Reduce contention
    }
  }
});
```

### Redis Cache

```typescript
const shield = new HyperShield({
  cache: {
    provider: 'redis',
    connection: {
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      enableOfflineQueue: false,
      commandTimeout: 500,
      autoResendUnfulfilledCommands: false
    },
    compression: {
      enabled: true,
      threshold: 1024,
      level: 1 // Fastest compression
    }
  }
});
```

## Compression Strategies

### Dynamic Compression

```typescript
shield.compression({
  dynamicConfig: {
    defaultLevel: 6,
    rules: [
      {
        condition: (req, data) => data.length > 1_000_000,
        level: 9 // Max compression for large responses
      },
      {
        condition: (req) => req.headers['save-bandwidth'] === 'true',
        level: 9
      },
      {
        condition: (req) => req.headers['fast-response'] === 'true',
        level: 1 // Fastest compression
      }
    ]
  }
});
```

## Memory Management

### Cache Entry Size Limits

```typescript
shield.cache({
  maxEntrySize: '1mb',
  onSizeExceeded: (key, size) => {
    console.warn(`Cache entry ${key} exceeded size limit: ${size} bytes`);
  }
});
```

### Automatic Memory Recovery

```typescript
shield.memoryManager({
  threshold: 0.9, // 90% memory usage
  recovery: {
    strategy: 'adaptive',
    reduceTo: 0.7, // Reduce to 70%
    priorityFunction: (entry) => {
      return entry.hits * (Date.now() - entry.lastAccessed);
    }
  }
});
```

## Load Testing Results

| Configuration | RPS | Latency (p95) | Memory Usage |
|--------------|-----|---------------|--------------|
| Default      | 5000| 45ms         | 256MB       |
| Optimized    | 8000| 30ms         | 320MB       |
| High Memory  | 12000| 25ms        | 512MB       |

## Monitoring and Profiling

### Memory Leaks

```typescript
shield.monitor({
  memoryLeakDetection: {
    enabled: true,
    interval: '1h',
    growth: {
      threshold: '50mb',
      window: '6h'
    }
  }
});
```

### Performance Metrics

```typescript
shield.metrics({
  detailed: true,
  collection: {
    interval: 10000,
    percentiles: [0.5, 0.9, 0.95, 0.99]
  },
  alerting: {
    memoryThreshold: 0.85,
    latencyThreshold: 100
  }
});
```
