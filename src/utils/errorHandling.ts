
import { errorLoggingService } from '@/services/ErrorLoggingService';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

export class ErrorHandler {
  static handle(error: unknown, context?: string | ErrorContext): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorContext = typeof context === 'string' ? { action: context } : context;
    
    const logData = {
      message: errorMessage,
      context: errorContext,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    };

    console.error('Error occurred:', logData);

    // Log to centralized error logging service
    if (error instanceof Error) {
      errorLoggingService.logError({
        error_message: error.message,
        error_stack: error.stack,
        component_name: errorContext?.component,
        context: errorContext,
        severity: this.determineSeverity(error)
      }).catch(loggingError => {
        console.error('Failed to log error to service:', loggingError);
      });
    }
  }

  static async handleAsync(
    operation: () => Promise<void>,
    context?: string | ErrorContext
  ): Promise<boolean> {
    try {
      await operation();
      return true;
    } catch (error) {
      this.handle(error, context);
      return false;
    }
  }

  static createUserFriendlyMessage(error: unknown): string {
    if (error instanceof Error) {
      // Map common error types to user-friendly messages
      if (error.message.includes('network')) {
        return 'Network connection issue. Please check your internet connection.';
      }
      if (error.message.includes('permission')) {
        return 'You do not have permission to perform this action.';
      }
      if (error.message.includes('not found')) {
        return 'The requested item could not be found.';
      }
      if (error.message.includes('validation')) {
        return 'Please check your input and try again.';
      }
      if (error.message.includes('timeout')) {
        return 'The request took too long. Please try again.';
      }
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  private static determineSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    const message = error.message.toLowerCase();
    
    if (message.includes('permission') || message.includes('unauthorized')) {
      return 'high';
    }
    
    if (message.includes('network') || message.includes('timeout')) {
      return 'medium';
    }
    
    if (message.includes('not found') || message.includes('validation')) {
      return 'low';
    }
    
    return 'medium';
  }
}

export const errorHandler = new ErrorHandler();
