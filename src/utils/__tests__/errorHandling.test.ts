
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
    it('logs error with context', () => {
      const error = new Error('Test error');
      ErrorHandler.handle(error, { action: 'test-context' });

      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('logs error with object context', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent', userId: '123' };
      ErrorHandler.handle(error, context);

      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('handles non-Error objects', () => {
      const error = new Error('String error converted to Error');
      ErrorHandler.handle(error, { action: 'test-context' });

      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('withErrorHandling', () => {
    it('returns result for successful operations', async () => {
      const successOperation = jest.fn().mockResolvedValue('success');
      const result = await ErrorHandler.withErrorHandling(successOperation, { action: 'test-context' });

      expect(result).toBe('success');
      expect(successOperation).toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('returns null and logs error for failed operations', async () => {
      const error = new Error('Async error');
      const failOperation = jest.fn().mockRejectedValue(error);
      const result = await ErrorHandler.withErrorHandling(failOperation, { action: 'test-context' });

      expect(result).toBe(null);
      expect(failOperation).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('createUserFriendlyMessage', () => {
    it('returns network error message for network errors', () => {
      const error = new Error('network timeout');
      error.name = 'NetworkError';
      const message = ErrorHandler.createUserFriendlyMessage(error);
      expect(message).toBe('Connection problem. Please check your internet and try again.');
    });

    it('returns permission error message for permission errors', () => {
      const error = new Error('permission denied');
      error.name = 'AuthorizationError';
      const message = ErrorHandler.createUserFriendlyMessage(error);
      expect(message).toBe('You don\'t have permission to perform this action.');
    });

    it('returns not found error message for not found errors', () => {
      const error = new Error('resource not found');
      error.name = 'NotFoundError';
      const message = ErrorHandler.createUserFriendlyMessage(error);
      expect(message).toBe('The requested item could not be found.');
    });

    it('returns generic error message for unknown errors', () => {
      const error = new Error('unknown error');
      const message = ErrorHandler.createUserFriendlyMessage(error);
      expect(message).toBe('Something went wrong. Please try again.');
    });
  });
});
