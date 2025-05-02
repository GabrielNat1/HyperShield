# Metrics Guide

HyperShield provides built-in metrics using Prometheus client library. This helps monitor application performance and behavior.

## Available Metrics

- HTTP request counts and durations
- Cache hit/miss ratios
- Compression ratios
- Memory usage
- Response times

## Basic Usage

```typescript
const shield = new HyperShield({
    metrics: {
        enabled: true,
        path: '/metrics'
    }
});

// Access metrics endpoint
// GET /metrics
```

## Custom Metrics

```typescript
import { MetricsService } from 'hypershield';

// Create custom counter
metrics.createCounter('custom_operation_total', 'Description', ['label1']);

// Increment counter
metrics.incrementCounter('custom_operation_total', { label1: 'value' });
```

## Integration with Prometheus

1. Enable metrics in your application
2. Configure Prometheus to scrape your /metrics endpoint
3. Create dashboards in Grafana using the collected metrics
