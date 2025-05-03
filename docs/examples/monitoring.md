# Monitoring Examples

## Metrics

```typescript
import { HyperShield } from 'hypershield';

const shield = new HyperShield({
  metrics: {
    enabled: true
  }
});

// Custom metrics
shield.metrics.createCounter('business_operations', 'Business operations count');
shield.metrics.incrementCounter('business_operations', { type: 'order' });

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  const metrics = await shield.getMetrics();
  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});
```

## Alerts

```typescript
const shield = new HyperShield({
  alerts: {
    enabled: true,
    providers: ['console', 'webhook']
  }
});

// Configure alerts
shield.alerts.addRule({
  name: 'high_error_rate',
  condition: (metrics) => metrics.errorRate > 0.05,
  throttle: '5m',
  destinations: ['webhook']
});

// Manual alerts
await shield.alerts.send('error', 'High memory usage detected', {
  memory: process.memoryUsage()
});

// Event-based alerts
shield.onEvent('cache:error', async (event) => {
  await shield.alerts.send('error', 
    `Cache error: ${event.error.message}`,
    { key: event.key }
  );
});
```
