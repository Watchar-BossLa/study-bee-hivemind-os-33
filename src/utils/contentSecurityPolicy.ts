
interface CSPDirectives {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'connect-src'?: string[];
  'font-src'?: string[];
  'object-src'?: string[];
  'media-src'?: string[];
  'frame-src'?: string[];
  'worker-src'?: string[];
  'child-src'?: string[];
  'frame-ancestors'?: string[];
  'form-action'?: string[];
  'base-uri'?: string[];
  'manifest-src'?: string[];
  'upgrade-insecure-requests'?: string[];
}

export class ContentSecurityPolicy {
  private static readonly DEVELOPMENT_CSP: CSPDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://cdn.gpteng.co",
      "https://5615ee4e-9397-4615-a170-5c4fd36c9ac9.lovableproject.com"
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],
    'img-src': [
      "'self'",
      "data:",
      "blob:",
      "https:"
    ],
    'connect-src': [
      "'self'",
      "https://api.openai.com",
      "https://*.supabase.co",
      "wss://*.supabase.co",
      "https://sentry.io"
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    'object-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  };

  private static readonly PRODUCTION_CSP: CSPDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "https://cdn.gpteng.co"
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],
    'img-src': [
      "'self'",
      "data:",
      "https:"
    ],
    'connect-src': [
      "'self'",
      "https://*.supabase.co",
      "wss://*.supabase.co",
      "https://sentry.io",
      "https://*.lovable.app"
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    'object-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': []
  };

  static generateCSPString(isDevelopment: boolean = false): string {
    const directives = isDevelopment ? this.DEVELOPMENT_CSP : this.PRODUCTION_CSP;
    
    return Object.entries(directives)
      .map(([directive, sources]) => {
        if (sources.length === 0) {
          return directive;
        }
        return `${directive} ${sources.join(' ')}`;
      })
      .join('; ');
  }

  static injectCSP(): void {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const cspString = this.generateCSPString(isDevelopment);
    
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCSP) {
      existingCSP.remove();
    }
    
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('http-equiv', 'Content-Security-Policy');
    metaTag.setAttribute('content', cspString);
    document.head.appendChild(metaTag);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔒 Content Security Policy ${isDevelopment ? '(Development)' : '(Production)'} injected`);
    }
  }

  static reportCSPViolation(violationReport: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('CSP Violation:', violationReport);
    }
    
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/security/csp-violation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          violation: violationReport,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(() => {
        // Fail silently in production
      });
    }
  }

  static setupCSPReporting(): void {
    document.addEventListener('securitypolicyviolation', (event) => {
      this.reportCSPViolation({
        blockedURI: event.blockedURI,
        disposition: event.disposition,
        documentURI: event.documentURI,
        effectiveDirective: event.effectiveDirective,
        originalPolicy: event.originalPolicy,
        referrer: event.referrer,
        statusCode: event.statusCode,
        violatedDirective: event.violatedDirective
      });
    });
  }
}
