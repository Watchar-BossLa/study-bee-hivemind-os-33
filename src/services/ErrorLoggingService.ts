
import { BaseService, ServiceResponse } from './base/BaseService';

export interface ErrorLog {
  id: string;
  error_message: string;
  error_stack?: string;
  component_name?: string;
  user_id?: string;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export interface CreateErrorLogData {
  error_message: string;
  error_stack?: string;
  component_name?: string;
  context?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export class ErrorLoggingService extends BaseService {
  constructor() {
    super({ retryAttempts: 1, timeout: 5000 });
  }

  async logError(data: CreateErrorLogData): Promise<ServiceResponse<ErrorLog>> {
    return this.executeWithRetry(async () => {
      // In a real implementation, this would send to your logging service
      // For now, we'll just log to console and return a mock response
      const errorLog: ErrorLog = {
        id: crypto.randomUUID(),
        error_message: data.error_message,
        error_stack: data.error_stack,
        component_name: data.component_name,
        context: data.context,
        severity: data.severity || 'medium',
        created_at: new Date().toISOString()
      };

      console.error('Error logged:', errorLog);
      
      // In production, you would send this to your monitoring service
      // await supabase.from('error_logs').insert(errorLog);
      
      return errorLog;
    }, 'error-logging');
  }

  async getErrorLogs(limit: number = 50): Promise<ServiceResponse<ErrorLog[]>> {
    return this.executeWithRetry(async () => {
      // In a real implementation, this would fetch from your database
      // For now, return an empty array
      return [];
    }, 'error-logs-fetching');
  }

  static createFromError(
    error: Error, 
    componentName?: string, 
    context?: Record<string, any>
  ): CreateErrorLogData {
    return {
      error_message: error.message,
      error_stack: error.stack,
      component_name: componentName,
      context,
      severity: ErrorLoggingService.determineSeverity(error)
    };
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

export const errorLoggingService = new ErrorLoggingService();
