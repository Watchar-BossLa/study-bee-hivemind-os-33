
import { PRODUCTION_CONFIG } from '@/config/production';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (!PRODUCTION_CONFIG.enableConsoleLogging) return false;
    
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    const currentLevel = levels[PRODUCTION_CONFIG.logLevel as LogLevel] || 1;
    return levels[level] >= currentLevel;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
}

export const logger = new Logger();
