import { MetricsService } from '../../../src/domains/metrics/application/metricsService';
import * as promClient from 'prom-client';

describe('MetricsService', () => {
  let metrics: MetricsService;

  beforeEach(() => {
    metrics = new MetricsService();
  });

  it('should increment counters correctly', async () => {
    metrics.incrementCounter('http_requests_total', { method: 'GET', path: '/test', status: '200' });
    metrics.incrementCounter('http_requests_total', { method: 'GET', path: '/test', status: '200' });

    expect((await (await metrics.getRegistry().getSingleMetric('http_requests_total')?.get()))?.values ?? []).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          labels: { method: 'GET', path: '/test', status: '200' },
          value: 2
        })
      ])
    );
  });

  it('should record durations in histograms', async () => {
    metrics.recordDuration('http_request_duration_ms', 100, { method: 'GET', path: '/test' });

    const histogram = metrics.getRegistry().getSingleMetric('http_request_duration_ms');
    expect((await histogram?.get())?.values.length).toBeGreaterThan(0);
  });

  it('should handle cache metrics', async () => {
    metrics.incrementCounter('cache_hits_total', { cache_type: 'memory' });
    metrics.incrementCounter('cache_misses_total', { cache_type: 'memory' });

    const hits = metrics.getRegistry().getSingleMetric('cache_hits_total');
    const misses = metrics.getRegistry().getSingleMetric('cache_misses_total');

    expect((await hits?.get())?.values[0].value).toBe(1);
    expect((await misses?.get())?.values[0].value).toBe(1);
  });

  it('should clear metrics', async () => {
    const counter = new promClient.Counter({
      name: 'test_counter',
      help: 'test counter',
      registers: [metrics.getRegistry()]
    });
    
    counter.inc();
    metrics.clearMetrics();

    const metricData = await metrics.getRegistry().metrics();
    expect(metricData).not.toContain('test_counter');
  });
});
