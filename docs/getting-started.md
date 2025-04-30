# Getting Started

## Installation

First, install HyperShield using npm:

```bash
npm install hypershield
```

## Basic Usage

### With Express

```typescript
import express from 'express';
import { HyperShield } from 'hypershield';

const app = express();
const shield = new HyperShield({
  cache: {
    enabled: true,
    provider: 'redis',
    ttl: 3600
  }
});

// Use compression middleware
app.use(shield.compression());

// Use caching middleware
app.get('/api/data', shield.cache(), (req, res) => {
  res.json({ data: 'cached response' });
});
```

### Monitoring

```typescript
shield.onEvent('cache:hit', (event) => {
  console.log(`Cache hit for key: ${event.key}`);
});

shield.onEvent('cache:miss', (event) => {
  console.log(`Cache miss for key: ${event.key}`);
});
```
