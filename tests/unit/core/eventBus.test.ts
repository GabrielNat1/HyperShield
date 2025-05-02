import { EventBus } from '../../../src/core/events/eventBus';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('should notify subscribers when events are published', () => {
    const handler = jest.fn();
    eventBus.subscribe('test', handler);

    const eventData = { message: 'Hello' };
    eventBus.publish('test', eventData);

    expect(handler).toHaveBeenCalledWith(eventData);
  });

  it('should allow multiple subscribers for same event', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    eventBus.subscribe('test', handler1);
    eventBus.subscribe('test', handler2);

    eventBus.publish('test', { data: 123 });

    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  it('should not notify subscribers of different events', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    eventBus.subscribe('event1', handler1);
    eventBus.subscribe('event2', handler2);

    eventBus.publish('event1', {});

    expect(handler1).toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });
});
