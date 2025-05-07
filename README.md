# HyperShield

[![CI](https://github.com/GabrielNat1/HyperShield/actions/workflows/ci.yml/badge.svg)](https://github.com/GabrielNat1/HyperShield/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/GabrielNat1/HyperShield/branch/main/graph/badge.svg)](https://codecov.io/gh/GabrielNat1/HyperShield)
[![npm version](https://badge.fury.io/js/hypershield.svg)](https://badge.fury.io/js/hypershield)
![status](https://img.shields.io/badge/status-beta-blue)


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

See [examples](./docs/examples/) for more complex use cases.

## Installation

```bash
npm install hypershield
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
