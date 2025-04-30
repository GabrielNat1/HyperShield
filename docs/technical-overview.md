# Technical Overview

## Architecture

HyperShield follows a domain-driven design approach with the following key components:

![Architecture Diagram](./assets/architecture.svg)

### Core Components

- **Cache Layer**: Supports multiple providers (Redis, Memory)
- **Compression Service**: GZIP implementation with extensible interface
- **Alert System**: Configurable alert dispatching with multiple destinations

### Directory Structure

```
src/
├── adapters/        # Framework adapters (Express, Fastify)
├── core/           # Core types and utilities
├── domains/        # Business logic organized by domain
└── shared/         # Shared utilities and services
```

## Configuration

Detailed configuration options for each component:

### Cache Configuration
```typescript
interface CacheConfig {
  enabled: boolean;
  provider: 'redis' | 'memory';
  ttl: number;
  connection?: {
    host: string;
    port: number;
  }
}
```

### Compression Configuration
```typescript
interface CompressionConfig {
  enabled: boolean;
  type: 'gzip';
  level?: number;
}
```
