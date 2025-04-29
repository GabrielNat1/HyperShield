type EventHandler = (data: any) => void;

export class EventBus {
    private handlers: Map<string, EventHandler[]> = new Map();

    public subscribe(event: string, handler: EventHandler): void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event)?.push(handler);
    }

    public publish(event: string, data: any): void {
        const eventHandlers = this.handlers.get(event);
        if (eventHandlers) {
            eventHandlers.forEach(handler => handler(data));
        }
    }
}
