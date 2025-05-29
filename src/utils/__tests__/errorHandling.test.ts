
import { ErrorHandler } from '../errorHandling';

describe('ErrorHandler', () => {
  const originalConsoleError = console.error;
  let mockConsoleError: jest.Mock;

  beforeEach(() => {
    mockConsoleError = jest.fn();
    console.error = mockConsoleError;
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('handle', () => {
    it('logs error with message context', () => {
      const error = new Error('Test error');
      ErrorHandler.handle(error, 'test-context');

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error occurred:',
        expect.objectContaining({
          message: 'Test error',
          context: { action: 'test-context' },
          timestamp: expect.any(String),
          stack: expect.any(String)
        })
      );
    });

    it('logs error with object context', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent', userId: '123' };
      ErrorHandler.handle(error, context);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error occurred:',
        expect.objectContaining({
          message: 'Test error',
          context: context,
          timestamp: expect.any(String),
          stack: expect.any(String)
        })
      );
    });

    it('handles non-Error objects', () => {
      ErrorHandler.handle('String error', 'test-context');

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error occurred:',
        expect.objectContaining({
          message: 'Unknown error',
          context: { action: 'test-context' },
          timestamp: expect.any(String),
          stack: undefined
        })
      );
    });
  });

  describe('handleAsync', () => {
    it('returns true for successful operations', async () => {
      const successOperation = jest.fn().mockResolvedValue(undefined);
      const result = await ErrorHandler.handleAsync(successOperation, 'test-context');

      expect(result).toBe(true);
      expect(successOperation).toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('returns false and logs error for failed operations', async () => {
      const error = new Error('Async error');
      const failOperation = jest.fn().mockRejectedValue(error);
      const result = await ErrorHandler.handleAsync(failOperation, 'test-context');

      expect(result).toBe(false);
      expect(failOperation).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error occurred:',
        expect.objectContaining({
          message: 'Async error',
          context: { action: 'test-context' }
        })
      );
    });
  });

  describe('createUserFriendlyMessage', () => {
    it('returns network error message for network errors', () => {
      const error = new Error('network timeout');
      const message = ErrorHandler.createUserFriendlyMessage(error);
      expect(message).toBe('Network connection issue. Please check your internet connection.');
    });

    it('returns permission error message for permission errors', () => {
      const error = new Error('permission denied');
      const message = ErrorHandler.createUserFriendlyMessage(error);
      expect(message).toBe('You do not have permission to perform this action.');
    });

    it('returns not found error message for not found errors', () => {
      const error = new Error('resource not found');
      const message = ErrorHandler.createUserFriendlyMessage(error);
      expect(message).toBe('The requested item could not be found.');
    });

    it('returns generic error message for unknown errors', () => {
      const error = new Error('unknown error');
      const message = ErrorHandler.createUserFriendlyMessage(error);
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });

    it('returns generic message for non-Error objects', () => {
      const message = ErrorHandler.createUserFriendlyMessage('string error');
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });
  });
});
