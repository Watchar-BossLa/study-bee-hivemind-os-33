
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  tags?: string[];
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>, tags?: string[]): void;
  info(message: string, context?: Record<string, unknown>, tags?: string[]): void;
  warn(message: string, context?: Record<string, unknown>, tags?: string[]): void;
  error(message: string | Error, context?: Record<string, unknown>, tags?: string[]): void;
}

class ConsoleLogger implements Logger {
  private readonly minLevel: LogLevel;
  private readonly levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(minLevel: LogLevel = 'info') {
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.minLevel];
  }

  private createLogEntry(
    level: LogLevel,
    message: string | Error,
    context?: Record<string, unknown>,
    tags?: string[]
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message: message instanceof Error ? message.message : message,
      context: message instanceof Error 
        ? { ...context, stack: message.stack } 
        : context,
      tags,
    };
  }

  debug(message: string, context?: Record<string, unknown>, tags?: string[]): void {
    if (!this.shouldLog('debug')) return;
    const entry = this.createLogEntry('debug', message, context, tags);
    console.debug(`[${entry.timestamp}] DEBUG:`, entry.message, entry.context || '');
  }

  info(message: string, context?: Record<string, unknown>, tags?: string[]): void {
    if (!this.shouldLog('info')) return;
    const entry = this.createLogEntry('info', message, context, tags);
    console.info(`[${entry.timestamp}] INFO:`, entry.message, entry.context || '');
  }

  warn(message: string, context?: Record<string, unknown>, tags?: string[]): void {
    if (!this.shouldLog('warn')) return;
    const entry = this.createLogEntry('warn', message, context, tags);
    console.warn(`[${entry.timestamp}] WARN:`, entry.message, entry.context || '');
  }

  error(message: string | Error, context?: Record<string, unknown>, tags?: string[]): void {
    if (!this.shouldLog('error')) return;
    const entry = this.createLogEntry('error', message, context, tags);
    console.error(`[${entry.timestamp}] ERROR:`, entry.message, entry.context || '');
  }
}

// Create and export the logger singleton
const logger = new ConsoleLogger(
  process.env.NODE_ENV === 'development' ? 'debug' : 'info'
);

export { logger };
