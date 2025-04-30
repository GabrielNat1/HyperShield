import { Alert, AlertDestination } from '../domain/alert';

export interface AlertSender {
    send(alert: Alert): Promise<void>;
}

class ConsoleAlertSender implements AlertSender {
    async send(alert: Alert): Promise<void> {
        const color = this.getSeverityColor(alert.severity);
        console.log(`[${alert.severity.toUpperCase()}] ${color}${alert.message}\x1b[0m`);
    }

    private getSeverityColor(severity: Alert['severity']): string {
        const colors = {
            info: '\x1b[36m',    // cyan
            warning: '\x1b[33m',  // yellow
            error: '\x1b[31m',    // red
            critical: '\x1b[41m'  // red background
        };
        return colors[severity];
    }
}

class WebhookAlertSender implements AlertSender {
    private url: string;
    
    constructor(url: string) {
        this.url = url;
    }

    async send(alert: Alert): Promise<void> {
        await fetch(this.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alert)
        });
    }
}

export class AlertSenderFactory {
    static createSender(destination: AlertDestination, config?: any): AlertSender {
        switch (destination) {
            case 'console':
                return new ConsoleAlertSender();
            case 'webhook':
                return new WebhookAlertSender(config.webhookUrl);
            default:
                throw new Error(`Alert destination ${destination} not implemented`);
        }
    }
}
