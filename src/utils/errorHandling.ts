
import { captureProductionError } from '@/services/monitoring/productionSentry';
import { logger } from './logger';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class ErrorHandler {
  static handle(error: Error, context?: ErrorContext): void {
    // Log the error
    logger.error('Application error', error, context);

    // Report to monitoring service
    captureProductionError(error, context);

    // Track error patterns for analytics
    this.trackErrorPattern(error, context);
  }

  static createUserFriendlyMessage(error: Error): string {
    // Map technical errors to user-friendly messages
    const errorMap: Record<string, string> = {
      'NetworkError': 'Connection problem. Please check your internet and try again.',
      'ValidationError': 'Please check your input and try again.',
      'AuthenticationError': 'Please sign in to continue.',
      'AuthorizationError': 'You don\'t have permission to perform this action.',
      'NotFoundError': 'The requested item could not be found.',
      'TimeoutError': 'The request took too long. Please try again.',
    };

    const errorType = error.name || 'Error';
    return errorMap[errorType] || 'Something went wrong. Please try again.';
  }

  private static trackErrorPattern(error: Error, context?: ErrorContext): void {
    // In production, this would send to analytics
    if (process.env.NODE_ENV === 'development') {
      console.group('🔍 Error Pattern Analysis');
      console.log('Error:', error.name);
      console.log('Message:', error.message);
      console.log('Context:', context);
      console.log('Stack:', error.stack);
      console.groupEnd();
    }
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: ErrorContext
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof Error) {
        this.handle(error, context);
      }
      return null;
    }
  }
}

export const handleGlobalError = (error: Error, errorInfo?: any): void => {
  ErrorHandler.handle(error, {
    component: 'ErrorBoundary',
    action: 'componentDidCatch',
    metadata: errorInfo
  });
};
