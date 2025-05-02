
import { useState, useCallback } from 'react';
import { captureException } from '@/services/monitoring/sentry';
import { logger } from '@/services/logger/logger';
import { toast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  reportToSentry?: boolean;
  fallbackMessage?: string;
  context?: Record<string, unknown>;
}

export function useErrorHandler(defaultOptions?: ErrorHandlerOptions) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleError = useCallback((
    err: unknown,
    options?: ErrorHandlerOptions
  ) => {
    const mergedOptions = {
      showToast: true,
      logError: true,
      reportToSentry: process.env.NODE_ENV === 'production',
      fallbackMessage: 'An unexpected error occurred',
      ...defaultOptions,
      ...options,
    };

    const error = err instanceof Error ? err : new Error(String(err));
    setError(error);
    
    if (mergedOptions.logError) {
      logger.error(error, mergedOptions.context);
    }
    
    if (mergedOptions.reportToSentry) {
      captureException(error, { 
        extra: mergedOptions.context 
      });
    }
    
    if (mergedOptions.showToast) {
      toast({
        title: 'Error',
        description: error.message || mergedOptions.fallbackMessage,
        variant: 'destructive',
      });
    }
    
    return error;
  }, [defaultOptions]);

  const asyncHandler = useCallback(async <T,>(
    promise: Promise<T>,
    options?: ErrorHandlerOptions
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await promise;
      return result;
    } catch (err) {
      handleError(err, options);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    error,
    isLoading,
    handleError,
    asyncHandler,
    reset
  };
}
