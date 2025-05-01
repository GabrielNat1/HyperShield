import * as promClient from 'prom-client';

export class MetricsService {
    private registry: promClient.Registry;
    private metrics: Map<string, promClient.Counter | promClient.Histogram | promClient.Gauge>;

    constructor() {
        this.registry = new promClient.Registry();
        this.metrics = new Map();
        this.initializeDefaultMetrics();
    }

    private initializeDefaultMetrics(): void {
        // Enable default metrics (CPU, memory, etc.)
        promClient.collectDefaultMetrics({
            register: this.registry
        });

        // HTTP requests counter
        this.createCounter('http_requests_total', 'Total number of HTTP requests', ['method', 'path', 'status']);

        // HTTP request duration histogram
        this.createHistogram('http_request_duration_ms', 'HTTP request duration in milliseconds', ['method', 'path']);

        // Cache metrics
        this.createCounter('cache_hits_total', 'Total number of cache hits', ['cache_type']);
        this.createCounter('cache_misses_total', 'Total number of cache misses', ['cache_type']);

        // Compression metrics
        this.createCounter('compression_bytes_total', 'Total bytes before/after compression', ['stage']);
        this.createHistogram('compression_ratio', 'Compression ratio distribution');
    }

    private createCounter(name: string, help: string, labelNames: string[] = []): void {
        const counter = new promClient.Counter({
            name,
            help,
            labelNames,
            registers: [this.registry]
        });
        this.metrics.set(name, counter);
    }

    private createHistogram(
        name: string, 
        help: string, 
        labelNames: string[] = [],
        buckets: number[] = promClient.linearBuckets(0, 100, 20)
    ): void {
        const histogram = new promClient.Histogram({
            name,
            help,
            labelNames,
            buckets,
            registers: [this.registry]
        });
        this.metrics.set(name, histogram);
    }

    public incrementCounter(name: string, labels: Record<string, string | number> = {}): void {
        const metric = this.metrics.get(name) as promClient.Counter;
        if (metric && metric instanceof promClient.Counter) {
            metric.inc(labels);
        } else {
            throw new Error(`Counter metric '${name}' not found`);
        }
    }

    public recordDuration(name: string, duration: number, labels: Record<string, string | number> = {}): void {
        const metric = this.metrics.get(name) as promClient.Histogram;
        if (metric && metric instanceof promClient.Histogram) {
            metric.observe(labels, duration);
        } else {
            throw new Error(`Histogram metric '${name}' not found`);
        }
    }

    public async getMetrics(): Promise<string> {
        return await this.registry.metrics();
    }

    public clearMetrics(): void {
        this.registry.clear();
    }

    public getRegistry(): promClient.Registry {
        return this.registry;
    }
}

export const globalMetrics = new MetricsService();
