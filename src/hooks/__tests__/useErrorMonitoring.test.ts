
import { renderHook, act } from '@testing-library/react';
import { useErrorMonitoring } from '../useErrorMonitoring';

// Mock the ErrorHandler and toast
jest.mock('@/utils/errorHandling');
jest.mock('sonner');

describe('useErrorMonitoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  it('should handle errors with default options', () => {
    const { result } = renderHook(() => useErrorMonitoring());
    
    const testError = new Error('Test error');
    
    act(() => {
      result.current.handleError(testError);
    });
    
    expect(console.error).toHaveBeenCalledWith(
      'Error in UnknownComponent:',
      testError
    );
  });

  it('should handle errors with custom component name', () => {
    const { result } = renderHook(() => 
      useErrorMonitoring({ componentName: 'TestComponent' })
    );
    
    const testError = new Error('Test error');
    
    act(() => {
      result.current.handleError(testError);
    });
    
    expect(console.error).toHaveBeenCalledWith(
      'Error in TestComponent:',
      testError
    );
  });

  it('should handle async operations successfully', async () => {
    const { result } = renderHook(() => useErrorMonitoring());
    
    const successOperation = jest.fn().mockResolvedValue(undefined);
    
    let operationResult: boolean | undefined;
    
    await act(async () => {
      operationResult = await result.current.handleAsyncOperation(successOperation);
    });
    
    expect(operationResult).toBe(true);
    expect(successOperation).toHaveBeenCalled();
  });

  it('should handle async operations with errors', async () => {
    const { result } = renderHook(() => useErrorMonitoring());
    
    const failingOperation = jest.fn().mockRejectedValue(new Error('Async error'));
    
    let operationResult: boolean | undefined;
    
    await act(async () => {
      operationResult = await result.current.handleAsyncOperation(failingOperation);
    });
    
    expect(operationResult).toBe(false);
    expect(failingOperation).toHaveBeenCalled();
  });
});
