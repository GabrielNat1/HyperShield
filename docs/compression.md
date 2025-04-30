# Compression Guide

HyperShield provides GZIP compression out of the box. This helps reduce bandwidth and improve response times.

## Basic Usage

```typescript
const shield = new HyperShield({
    compression: {
        enabled: true,
        type: 'gzip',
        level: 6 // 1 (fastest) to 9 (best compression)
    }
});
```

## Express Integration

```typescript
app.use(shield.compression()); // Global compression
// Or per route
app.get('/api/data', shield.compression(), (req, res) => {
    res.json({ data: 'compressed response' });
});
```

## Configuration Options

- `level`: Compression level (1-9)
- `threshold`: Minimum size in bytes before compressing
- `memLevel`: Memory usage level (1-9)

## Best Practices

1. Use compression for text-based responses (JSON, HTML, CSS, JS)
2. Set appropriate threshold to avoid compressing small responses
3. Consider CPU usage vs bandwidth savings
4. Enable only for clients that support it (Accept-Encoding)
