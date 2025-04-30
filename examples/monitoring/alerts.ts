/*import { HyperShield } from '../../src';
import { AlertService } from '../../src/domains/alerts/application/alertService';

const shield = new HyperShield({
    cache: {
        enabled: true,
        provider: 'memory',
        ttl: 3600
    }
});

const alertService = new AlertService({
    destinations: ['console', 'webhook'],
    throttleMs: 5000,
    retryAttempts: 3
});

// Monitorando eventos de cache
shield.onEvent('cache:miss', async (event) => {
    await alertService.alert(
        'warning',
        `Cache miss for key: ${event.key}`,
        'CacheMonitor',
        { timestamp: event.timestamp }
    );
});

// Monitorando erros
shield.onEvent('cache:error', async (event) => {
    await alertService.alert(
        'error',
        `Cache error: ${event.error?.message}`,
        'CacheMonitor',
        { error: event.error }
    );
});
*/