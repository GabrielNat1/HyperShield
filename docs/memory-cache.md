# Memory Cache Guide

HyperShield provides in-memory caching as an alternative to Redis. This is useful for:
- Development environments
- Small applications
- Scenarios where Redis is not available
- Testing and prototyping

## Usage

```typescript
const shield = new HyperShield({
    cache: {
        enabled: true,
        provider: 'memory',
        ttl: 3600 // Time-to-live in seconds
    }
});
```

## Considerations

1. Memory cache is not shared between processes
2. Data is lost when the application restarts
3. Memory usage grows with cached data
4. Best for development and small applications

## When to use Redis instead

- Production environments
- Microservices architecture
- High-traffic applications
- When data persistence is required
