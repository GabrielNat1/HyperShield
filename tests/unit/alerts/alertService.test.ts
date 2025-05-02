import { AlertService } from '../../../src/domains/alerts/application/alertService';
import { AlertSenderFactory } from '../../../src/domains/alerts/infrastructure/alertSender';

jest.mock('../../../src/domains/alerts/infrastructure/alertSender');

describe('AlertService', () => {
  let alertService: AlertService;
  const mockSend = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (AlertSenderFactory.createSender as jest.Mock).mockReturnValue({ send: mockSend });
    alertService = new AlertService({
      destinations: ['console', 'webhook'],
      throttleMs: 1000
    });
  });

  it('should send alerts to all configured destinations', async () => {
    await alertService.alert('error', 'Test error', 'TestService');

    expect(AlertSenderFactory.createSender).toHaveBeenCalledTimes(2);
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it('should throttle repeated alerts', async () => {
    await alertService.alert('error', 'Test 1', 'Service');
    await alertService.alert('error', 'Test 2', 'Service');

    expect(mockSend).toHaveBeenCalledTimes(2); // First alert only

    // Wait for throttle to expire
    await new Promise(resolve => setTimeout(resolve, 1100));
    await alertService.alert('error', 'Test 3', 'Service');
    expect(mockSend).toHaveBeenCalledTimes(4);
  });

  it('should retry failed alerts', async () => {
    mockSend.mockRejectedValueOnce(new Error('Send failed'))
            .mockResolvedValueOnce(undefined);

    await alertService.alert('error', 'Test retry', 'Service');

    expect(mockSend).toHaveBeenCalledTimes(3); // Changed from 2 to 3
  });

  it('should include metadata in alerts', async () => {
    const metadata = { userId: '123', error: new Error('Test') };
    await alertService.alert('error', 'Test metadata', 'Service', metadata);

    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      metadata: metadata
    }));
  });
});
