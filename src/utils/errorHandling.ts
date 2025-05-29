
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
    
    console.error('Error occurred:', {
      message: errorMessage,
      context: errorContext,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    });

    // In a real application, you would send this to your logging service
    // Example: LoggingService.logError(error, errorContext);
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
    }
    
    return 'An unexpected error occurred. Please try again.';
  }
}

export const errorHandler = new ErrorHandler();
