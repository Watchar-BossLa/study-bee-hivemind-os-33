
interface ValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  errors: string[];
  warnings: string[];
}

interface SecurityEvent {
  type: string;
  severity: 'low' | 'medium' | 'high';
  details: Record<string, any>;
  timestamp: Date;
}

export class SecurityValidationService {
  private static readonly XSS_PATTERNS = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /<form[^>]*>.*?<\/form>/gi
  ];

  private static readonly SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(--|\/\*|\*\/|;)/g,
    /(\b(OR|AND)\b.*?[=<>])/gi
  ];

  static validateUserInput(input: string, fieldName: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitizedValue = input;

    // Check for XSS patterns
    this.XSS_PATTERNS.forEach(pattern => {
      if (pattern.test(input)) {
        errors.push('Potentially dangerous content detected');
        sanitizedValue = sanitizedValue.replace(pattern, '');
      }
    });

    // Check for SQL injection patterns
    this.SQL_INJECTION_PATTERNS.forEach(pattern => {
      if (pattern.test(input)) {
        warnings.push('Suspicious SQL-like content detected');
      }
    });

    // Basic length validation
    if (input.length > 10000) {
      errors.push('Input too long');
    }

    // Check for excessive special characters
    const specialCharCount = (input.match(/[<>'"&]/g) || []).length;
    if (specialCharCount > input.length * 0.1) {
      warnings.push('High number of special characters detected');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue,
      errors,
      warnings
    };
  }

  static validateEmailInput(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors: string[] = [];

    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }

    if (email.length > 254) {
      errors.push('Email too long');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: email.toLowerCase().trim(),
      errors,
      warnings: []
    };
  }

  static validatePasswordInput(password: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      warnings.push('Password should contain uppercase letters');
    }

    if (!/[a-z]/.test(password)) {
      warnings.push('Password should contain lowercase letters');
    }

    if (!/\d/.test(password)) {
      warnings.push('Password should contain numbers');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      warnings.push('Password should contain special characters');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: password,
      errors,
      warnings
    };
  }

  static logSecurityEvent(
    type: string,
    details: Record<string, any>,
    severity: 'low' | 'medium' | 'high' = 'medium'
  ): void {
    const event: SecurityEvent = {
      type,
      severity,
      details,
      timestamp: new Date()
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const icon = severity === 'high' ? '🚨' : severity === 'medium' ? '⚠️' : 'ℹ️';
      console.warn(`${icon} Security Event: ${type}`, event);
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production' && severity === 'high') {
      // This would be sent to your security monitoring service
      console.error('High severity security event:', event);
    }
  }
}
