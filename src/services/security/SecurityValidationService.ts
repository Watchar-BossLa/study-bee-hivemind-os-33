
import { HTMLSanitizer } from '@/utils/htmlSanitizer';

interface ValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  errors: string[];
  warnings: string[];
}

export class SecurityValidationService {
  private static readonly MAX_INPUT_LENGTH = 10000;
  private static readonly SUSPICIOUS_PATTERNS = [
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /<script/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /on\w+\s*=/gi, // event handlers like onclick, onload
    /expression\s*\(/gi, // CSS expressions
    /import\s*\(/gi, // dynamic imports
  ];

  static validateUserInput(input: unknown, fieldName: string = 'input'): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      sanitizedValue: '',
      errors: [],
      warnings: []
    };

    // Type check
    if (typeof input !== 'string') {
      result.isValid = false;
      result.errors.push(`${fieldName} must be a string`);
      return result;
    }

    // Length check
    if (input.length > this.MAX_INPUT_LENGTH) {
      result.isValid = false;
      result.errors.push(`${fieldName} exceeds maximum length of ${this.MAX_INPUT_LENGTH} characters`);
      return result;
    }

    // Check for suspicious patterns
    for (const pattern of this.SUSPICIOUS_PATTERNS) {
      if (pattern.test(input)) {
        result.warnings.push(`Potentially unsafe content detected in ${fieldName}`);
        break;
      }
    }

    // Sanitize the input
    result.sanitizedValue = HTMLSanitizer.sanitizeUserInput(input);

    // Check if sanitization removed content
    if (result.sanitizedValue !== input) {
      result.warnings.push(`Some content was removed from ${fieldName} for security reasons`);
    }

    return result;
  }

  static validateEmailInput(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const result = this.validateUserInput(email, 'email');

    if (result.isValid && !emailRegex.test(result.sanitizedValue)) {
      result.isValid = false;
      result.errors.push('Invalid email format');
    }

    return result;
  }

  static validatePasswordInput(password: string): ValidationResult {
    const result = this.validateUserInput(password, 'password');

    if (result.isValid) {
      const minLength = 8;
      if (password.length < minLength) {
        result.isValid = false;
        result.errors.push(`Password must be at least ${minLength} characters long`);
      }

      // Check for basic password requirements
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChar) {
        result.warnings.push('Password should contain uppercase, lowercase, numbers, and special characters');
      }
    }

    return result;
  }

  static validateFileUpload(file: File, allowedTypes: string[] = []): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      sanitizedValue: file.name,
      errors: [],
      warnings: []
    };

    // File size check (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      result.isValid = false;
      result.errors.push('File size exceeds 10MB limit');
    }

    // File type check
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      result.isValid = false;
      result.errors.push(`File type ${file.type} is not allowed`);
    }

    // Check for suspicious file names
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (suspiciousExtensions.includes(fileExtension)) {
      result.isValid = false;
      result.errors.push('Executable files are not allowed');
    }

    return result;
  }

  static logSecurityEvent(event: string, details: any = {}, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const securityEvent = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.warn(`Security Event [${severity.toUpperCase()}]:`, securityEvent);

    // In production, this would send to a security monitoring service
    if (severity === 'high' || severity === 'critical') {
      console.error('CRITICAL SECURITY EVENT:', securityEvent);
    }
  }
}
