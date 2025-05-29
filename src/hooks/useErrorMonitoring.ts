
import { useCallback, useEffect } from 'react';
import { ErrorHandler } from '@/utils/errorHandling';
import { toast } from 'sonner';

interface UseErrorMonitoringOptions {
  componentName?: string;
  showToast?: boolean;
  logToService?: boolean;
}

export const useErrorMonitoring = (options: UseErrorMonitoringOptions = {}) => {
  const {
    componentName = 'UnknownComponent',
    showToast = true,
    logToService = true
  } = options;

  // Handle errors with consistent logging and user feedback
  const handleError = useCallback((error: Error, context?: Record<string, any>) => {
    const errorContext = {
      component: componentName,
      ...context
    };

    if (logToService) {
      ErrorHandler.handle(error, errorContext);
    }

    if (showToast) {
      const userMessage = ErrorHandler.createUserFriendlyMessage(error);
      toast.error(userMessage);
    }

    console.error(`Error in ${componentName}:`, error);
  }, [componentName, showToast, logToService]);

  // Handle async operations with error handling
  const handleAsyncOperation = useCallback(async (
    operation: () => Promise<void>,
    context?: Record<string, any>
  ): Promise<boolean> => {
    try {
      await operation();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        handleError(error, context);
      }
      return false;
    }
  }, [handleError]);

  // Set up global error listeners
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      handleError(error, { type: 'unhandled_promise_rejection' });
    };

    const handleGlobalError = (event: ErrorEvent) => {
      const error = new Error(event.message);
      error.stack = `${event.filename}:${event.lineno}:${event.colno}`;
      handleError(error, { type: 'global_error' });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, [handleError]);

  return {
    handleError,
    handleAsyncOperation
  };
};
