export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';
export type AlertDestination = 'console' | 'email' | 'webhook' | 'slack';

export interface Alert {
    id: string;
    severity: AlertSeverity;
    message: string;
    timestamp: Date;
    source: string;
    metadata?: Record<string, unknown>;
}

export interface AlertOptions {
    destinations: AlertDestination[];
    throttleMs?: number;
    retryAttempts?: number;
}
