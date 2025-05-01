import { Alert, AlertOptions, AlertSeverity } from '../domain/alert';
import { AlertSenderFactory } from '../infrastructure/alertSender';
import { randomUUID } from 'crypto';
import { ALERTS } from '../../../core/constants/constants';

export class AlertService {
    private options: AlertOptions;
    private throttleMap: Map<string, number> = new Map();

    constructor(options: AlertOptions) {
        this.options = {
            throttleMs: ALERTS.THROTTLE.DEFAULT_MS,
            retryAttempts: ALERTS.RETRY.DEFAULT_ATTEMPTS,
            ...options
        };
    }

    async alert(
        severity: AlertSeverity,
        message: string,
        source: string,
        metadata?: Record<string, unknown>
    ): Promise<void> {
        const alert: Alert = {
            id: randomUUID(),
            severity,
            message,
            timestamp: new Date(),
            source,
            metadata
        };

        if (this.shouldThrottle(alert)) {
            return;
        }

        const senders = this.options.destinations.map(dest => 
            AlertSenderFactory.createSender(dest)
        );

        await Promise.all(
            senders.map(sender => 
                this.sendWithRetry(sender.send.bind(sender), alert)
            )
        );
    }

    private shouldThrottle(alert: Alert): boolean {
        const key = `${alert.severity}:${alert.source}`;
        const now = Date.now();
        const lastAlert = this.throttleMap.get(key) || 0;

        if (now - lastAlert < (this.options.throttleMs || 0)) {
            return true;
        }

        this.throttleMap.set(key, now);
        return false;
    }

    private async sendWithRetry(
        sendFn: (alert: Alert) => Promise<void>,
        alert: Alert,
        attempt = 1
    ): Promise<void> {
        try {
            await sendFn(alert);
        } catch (error) {
            if (attempt < ALERTS.RETRY.MAX_ATTEMPTS) {
                await new Promise(resolve => 
                    setTimeout(resolve, ALERTS.RETRY.BASE_DELAY * attempt)
                );
                return this.sendWithRetry(sendFn, alert, attempt + 1);
            }
            throw error;
        }
    }
}
