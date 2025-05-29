
export interface ServiceConfig {
  retryAttempts?: number;
  timeout?: number;
  cacheEnabled?: boolean;
}

export interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
  cached?: boolean;
}

export abstract class BaseService {
  protected config: ServiceConfig;

  constructor(config: ServiceConfig = {}) {
    this.config = {
      retryAttempts: 3,
      timeout: 30000,
      cacheEnabled: true,
      ...config
    };
  }

  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<ServiceResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retryAttempts!; attempt++) {
      try {
        const data = await operation();
        return { data, error: null, success: true };
      } catch (error) {
        lastError = error as Error;
        console.warn(`Service operation failed (attempt ${attempt}/${this.config.retryAttempts}):`, {
          context,
          error: lastError.message
        });

        if (attempt < this.config.retryAttempts!) {
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
        }
      }
    }

    return { data: null, error: lastError, success: false };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
