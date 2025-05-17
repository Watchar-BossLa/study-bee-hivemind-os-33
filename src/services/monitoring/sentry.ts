
import * as Sentry from '@sentry/react';

// Initial setup
export const initSentry = () => {
  // Only initialize in production
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 0.7,
      environment: import.meta.env.MODE,
    });

    console.log('[Sentry] Initialized in', import.meta.env.MODE);
  } else {
    console.log('[Sentry] Not initialized in development mode');
  }
};

// Set user information once authenticated
export const setSentryUser = (user: { id: string; email?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
  });

  console.log('[Sentry] User context set');
};

// Clear user information on logout
export const clearSentryUser = () => {
  Sentry.setUser(null);
  console.log('[Sentry] User context cleared');
};

// Report an exception with optional context
export const captureException = (error: Error, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    if (context) {
      const scope = new Sentry.Scope();
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      Sentry.captureException(error, scope);
    } else {
      Sentry.captureException(error);
    }
  } else {
    console.error('[Error]', error, context);
  }
};

// Report a message with optional context and severity
export const captureMessage = (message: string, severity: Sentry.SeverityLevel = 'info', context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    if (context) {
      const scope = new Sentry.Scope();
      scope.setLevel(severity);
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      Sentry.captureMessage(message, scope);
    } else {
      Sentry.captureMessage(message, severity);
    }
  } else {
    const logMethod = severity === 'error' ? console.error : console.log;
    logMethod(`[${severity}]`, message, context);
  }
};
