# HyperShield

A high-performance middleware suite for building resilient APIs with built-in caching, compression, and monitoring capabilities.

## Features

- 🚀 High-performance caching with Redis/Memory support
- 🔄 GZIP compression middleware
- 📊 Built-in monitoring and alerts
- 🛡️ Rate limiting and circuit breaking
- 📝 Extensive logging capabilities
- 🔍 Detailed metrics collection
- ⚡ Optimized for high-throughput

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Technical Overview](./docs/technical-overview.md)
- [Advanced Usage](./docs/advanced-usage.md)
- [Compression Guide](./docs/compression.md)
- [Memory Cache Guide](./docs/memory-cache.md)
- [Redis Cache Guide](./docs/redis-cache.md)
- [Metrics & Monitoring](./docs/metrics.md)
- [Performance Tuning](./docs/performance-tuning.md)
- [Troubleshooting](./docs/troubleshooting.md)

## Quick Start

### Basic Setup

```typescript
import { HyperShield } from 'hypershield';
import express from 'express';

const app = express();
const shield = new HyperShield({
  cache: {
    enabled: true,
    provider: 'memory',
    ttl: 3600
  },
  compression: {
    enabled: true,
    type: 'gzip',
    level: 6
  }
});

shield.initialize();

// Use middleware
app.use(shield.compression());
app.use(shield.cache());

// Start monitoring
shield.metrics.enable();
```

### Advanced Configuration

```typescript
const shield = new HyperShield({
  cache: {
    enabled: true,
    provider: 'redis',
    ttl: 3600,
    connection: {
      host: 'localhost',
      port: 6379,
      password: 'secret',
      maxRetries: 3,
      reconnectStrategy: {
        maxAttempts: 5,
        initialDelay: 1000,
        maxDelay: 5000
      }
    }
  },
  compression: {
    enabled: true,
    type: 'gzip',
    level: 6,
    threshold: 1024
  },
  alerts: {
    enabled: true,
    providers: ['email', 'webhook'],
    throttleMs: 1000
  },
  metrics: {
    enabled: true,
    path: '/metrics',
    collectDefaultMetrics: true
  }
});
```

See [examples](./examples/) for more complex use cases.

## Installation

```bash
npm install hypershield
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
