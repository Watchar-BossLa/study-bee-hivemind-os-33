
import * as Sentry from '@sentry/react';
import { CaptureContext } from '@sentry/types';
import { logger } from '../logger/logger';

// Function to initialize Sentry
export const initSentry = (): void => {
  if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_SENTRY_DSN) {
    try {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        tracesSampleRate: 1.0,
        integrations: [
          new Sentry.BrowserTracing(),
          new Sentry.Replay({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        beforeSend(event) {
          // Don't send PII data
          if (event.user) {
            delete event.user.ip_address;
            delete event.user.email;
          }
          return event;
        },
      });
      logger.info('Sentry initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Sentry', { error });
    }
  } else {
    logger.info('Sentry not initialized: Not in production or DSN missing');
  }
};

// Function to capture exceptions
export const captureException = (
  error: Error, 
  context?: CaptureContext
): string => {
  logger.error(error);
  if (process.env.NODE_ENV === 'production') {
    // TypeScript fix: Pass context directly without type mismatch
    return Sentry.captureException(error, context);
  }
  return '';
};

// Function to capture messages
export const captureMessage = (
  message: string, 
  level?: Sentry.SeverityLevel,
  context?: CaptureContext
): string => {
  logger.info(message);
  if (process.env.NODE_ENV === 'production') {
    // TypeScript fix: Use overload with correct parameter order
    if (context) {
      return Sentry.captureMessage(message, context);
    }
    return Sentry.captureMessage(message, level);
  }
  return '';
};

// Create a React Error Boundary wrapper
export const SentryErrorBoundary = Sentry.ErrorBoundary;
