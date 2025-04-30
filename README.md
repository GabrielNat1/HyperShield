# HyperShield

A high-performance middleware suite for building resilient APIs with built-in caching, compression, and monitoring capabilities.

## Features

- 🚀 High-performance caching with Redis/Memory support
- 🔄 GZIP compression middleware
- 📊 Built-in monitoring and alerts
- 🛡️ Rate limiting and circuit breaking
- 📝 Extensive logging capabilities

## Quick Start

### Using Memory Cache (No Redis required)

```typescript
import { HyperShield } from 'hypershield';

const shield = new HyperShield({
  cache: {
    enabled: true,
    provider: 'memory', // In-memory cache
    ttl: 3600
  }
});

shield.initialize();
```

### Using Redis Cache

```typescript
import { HyperShield } from 'hypershield';

const shield = new HyperShield({
  cache: {
    enabled: true,
    provider: 'redis',
    ttl: 3600,
    connection: {
      host: 'localhost',
      port: 6379
    }
  }
});

shield.initialize();
```

Choose the cache provider that best fits your needs:
- `memory`: Simple setup, perfect for development and small applications
- `redis`: Better for production and distributed systems

## Documentation

For detailed documentation, please check the [docs](./docs) directory.

View our [architectural diagram](./assets/architecture.svg) to understand how HyperShield components work together.

## Table of Contents

1. [Getting Started](./docs/getting-started.md)
2. [Technical Overview](./docs/technical-overview.md)
3. [Compression Guide](./docs/compression.md)
4. [Memory Cache Guide](./docs/memory-cache.md)

## Quick Links

- [Architecture Diagram](./assets/architecture.svg)
- [Configuration Examples](./examples/)

## Installation

```bash
npm install hypershield
```

## License

MIT
