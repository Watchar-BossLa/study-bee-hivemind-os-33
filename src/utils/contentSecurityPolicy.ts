
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
      "'unsafe-inline'", // Allow inline scripts in development
      "'unsafe-eval'", // Allow eval() in development for HMR
      "https://cdn.gpteng.co", // Lovable badge
      "https://5615ee4e-9397-4615-a170-5c4fd36c9ac9.lovableproject.com"
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Allow inline styles
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
      "wss://*.supabase.co"
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
      "https://cdn.gpteng.co" // Lovable badge only
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components/emotion
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
      "wss://*.supabase.co"
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
    
    // Remove existing CSP meta tag if present
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCSP) {
      existingCSP.remove();
    }
    
    // Create and inject new CSP meta tag
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('http-equiv', 'Content-Security-Policy');
    metaTag.setAttribute('content', cspString);
    document.head.appendChild(metaTag);
    
    console.log(`🔒 Content Security Policy ${isDevelopment ? '(Development)' : '(Production)'} injected`);
  }

  static reportCSPViolation(violationReport: any): void {
    console.error('CSP Violation:', violationReport);
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to security monitoring endpoint
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
      }).catch(error => {
        console.error('Failed to report CSP violation:', error);
      });
    }
  }

  static setupCSPReporting(): void {
    // Listen for CSP violations
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
