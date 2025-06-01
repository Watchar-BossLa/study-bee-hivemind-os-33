
// Production configuration and constants
export const PRODUCTION_CONFIG = {
  // Error reporting
  enableSentry: process.env.NODE_ENV === 'production',
  sentryDSN: import.meta.env.VITE_SENTRY_DSN,
  
  // Logging levels
  logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  enableConsoleLogging: process.env.NODE_ENV !== 'production',
  
  // Performance monitoring
  enablePerformanceMonitoring: true,
  performanceSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Cache settings
  cacheTimeout: process.env.NODE_ENV === 'production' ? 300000 : 60000, // 5min prod, 1min dev
  
  // API settings
  apiTimeout: 30000,
  retryAttempts: process.env.NODE_ENV === 'production' ? 3 : 1,
} as const;

export const isProduction = () => process.env.NODE_ENV === 'production';
export const isDevelopment = () => process.env.NODE_ENV === 'development';
