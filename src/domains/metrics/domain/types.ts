export interface MetricLabels {
    [key: string]: string | number;
}

export interface MetricOptions {
    name: string;
    help: string;
    labelNames?: string[];
    buckets?: number[];
}

export type MetricType = 'counter' | 'histogram' | 'gauge';
