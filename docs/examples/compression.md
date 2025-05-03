# Compression Examples

## Basic Compression

```typescript
import { HyperShield } from 'hypershield';
import express from 'express';

const shield = new HyperShield({
  compression: {
    enabled: true,
    type: 'gzip',
    level: 6
  }
});

// Global compression
app.use(shield.compression());

// Route-specific compression
app.get('/api/data', 
  shield.compression({ level: 9 }), 
  (req, res) => {
    res.json(largeData);
  }
);
```

## Advanced Compression

```typescript
// Dynamic compression level
app.use(shield.compression({
  dynamicLevel: true,
  levelProvider: (req) => {
    if (req.headers['save-bandwidth']) return 9;
    if (req.headers['fast-response']) return 1;
    return 6;
  },
  threshold: 1024 // Only compress responses > 1KB
}));

// Content-type based compression
app.use(shield.compression({
  filter: (req, res) => {
    return /json|text|javascript/.test(res.getHeader('Content-Type'));
  }
}));

// Manual compression
const compressor = shield.createCompressor('gzip', { level: 9 });
const compressed = await compressor.compress(largeData);
```
