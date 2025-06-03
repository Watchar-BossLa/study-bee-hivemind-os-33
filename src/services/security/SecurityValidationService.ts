
import DOMPurify from 'dompurify';
import { logger } from '@/utils/logger';

export class SecurityValidationService {
  // Input sanitization
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }

  static sanitizeText(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  // SQL injection prevention
  static validateInput(input: string, type: 'email' | 'text' | 'number' | 'uuid'): boolean {
    const patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      text: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
      number: /^\d+$/,
      uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    };

    return patterns[type]?.test(input) || false;
  }

  // XSS prevention
  static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  // CSRF protection
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken;
  }

  // Content Security Policy headers
  static getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://zhvhqpdcxgmcdoowahql.supabase.co",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://zhvhqpdcxgmcdoowahql.supabase.co wss://zhvhqpdcxgmcdoowahql.supabase.co",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; '),
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }

  // Audit logging
  static async logSecurityEvent(
    event: string,
    details: Record<string, any>,
    severity: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<void> {
    try {
      logger.warn(`Security Event [${severity.toUpperCase()}]: ${event}`, details);
      
      // In production, you might want to send this to a security monitoring service
      if (severity === 'high') {
        console.error('HIGH SEVERITY SECURITY EVENT:', { event, details });
      }
    } catch (error) {
      logger.error('Failed to log security event:', error);
    }
  }
}
