
import { toast } from 'sonner';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = {
  handle: (error: unknown, context?: string) => {
    console.error(`Error in ${context}:`, error);
    
    if (error instanceof AppError) {
      toast.error(error.message);
    } else if (error instanceof Error) {
      toast.error(`Something went wrong: ${error.message}`);
    } else {
      toast.error('An unexpected error occurred');
    }
  },

  handleAsync: async <T>(
    asyncFn: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      console.error('Async operation failed:', error);
      toast.error(errorMessage || 'Operation failed');
      return null;
    }
  }
};
