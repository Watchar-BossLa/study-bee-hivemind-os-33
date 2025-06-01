
import * as Sentry from '@sentry/react';
import { PRODUCTION_CONFIG } from '@/config/production';
import { logger } from '@/utils/logger';

export const initProductionSentry = (): void => {
  if (!PRODUCTION_CONFIG.enableSentry || !PRODUCTION_CONFIG.sentryDSN) {
    logger.info('Sentry not initialized - missing configuration');
    return;
  }

  Sentry.init({
    dsn: PRODUCTION_CONFIG.sentryDSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', /^https:\/\/.*\.supabase\.co\//, /^https:\/\/.*\.lovable\.app\//],
      }),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: PRODUCTION_CONFIG.performanceSampleRate,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend: (event) => {
      // Filter out non-critical errors in production
      if (PRODUCTION_CONFIG.enableSentry && event.exception) {
        const error = event.exception.values?.[0];
        if (error?.value?.includes('Non-Error promise rejection captured')) {
          return null;
        }
      }
      return event;
    },
  });

  logger.info('Production Sentry initialized');
};

export const captureProductionError = (error: Error, context?: Record<string, any>): void => {
  if (PRODUCTION_CONFIG.enableSentry) {
    Sentry.captureException(error, { extra: context });
  }
  logger.error('Production error captured', error, context);
};
