
interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'xss' | 'csrf' | 'data-exposure' | 'authentication' | 'authorization' | 'content-security';
  message: string;
  recommendation: string;
  element?: Element;
}

interface SecurityReport {
  issues: SecurityIssue[];
  score: number;
  criticalCount: number;
  highCount: number;
  recommendations: string[];
}

export class SecurityValidator {
  private static issues: SecurityIssue[] = [];

  static generateSecurityReport(): SecurityReport {
    this.issues = [];
    
    this.checkDangerouslySetInnerHTML();
    this.checkExposedCredentials();
    this.checkInsecureStorage();
    this.checkExternalLinks();
    this.checkFormSecurity();
    this.checkContentSecurityPolicy();
    this.checkMixedContent();
    this.checkClickjackingProtection();
    
    const criticalCount = this.issues.filter(i => i.severity === 'critical').length;
    const highCount = this.issues.filter(i => i.severity === 'high').length;
    const mediumCount = this.issues.filter(i => i.severity === 'medium').length;
    const lowCount = this.issues.filter(i => i.severity === 'low').length;
    
    // Security score calculation (0-100)
    const score = Math.max(0, 100 - (criticalCount * 40) - (highCount * 20) - (mediumCount * 10) - (lowCount * 5));
    
    const recommendations = this.generateRecommendations();
    
    return {
      issues: [...this.issues],
      score,
      criticalCount,
      highCount,
      recommendations
    };
  }

  private static checkDangerouslySetInnerHTML(): void {
    // Check for any remaining dangerous innerHTML usage
    const elements = document.querySelectorAll('*');
    elements.forEach((element) => {
      if (element.innerHTML.includes('<script>') || element.innerHTML.includes('javascript:')) {
        this.addIssue({
          severity: 'critical',
          category: 'xss',
          message: 'Potential XSS vulnerability detected in innerHTML',
          recommendation: 'Use HTMLSanitizer.validateAndSanitize() before setting innerHTML',
          element
        });
      }
    });

    // Check for data attributes that could be exploited
    const dataElements = document.querySelectorAll('[data-*]');
    dataElements.forEach((element) => {
      Array.from(element.attributes).forEach((attr) => {
        if (attr.name.startsWith('data-') && attr.value.includes('<script>')) {
          this.addIssue({
            severity: 'high',
            category: 'xss',
            message: `Suspicious content in data attribute: ${attr.name}`,
            recommendation: 'Sanitize all data attributes containing HTML content'
          });
        }
      });
    });
  }

  private static checkExposedCredentials(): void {
    // Check for exposed credentials in code
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script) => {
      const content = script.textContent || '';
      const suspiciousPatterns = [
        /password\s*[:=]\s*['"]/i,
        /api[_-]?key\s*[:=]\s*['"]/i,
        /secret\s*[:=]\s*['"]/i,
        /token\s*[:=]\s*['"]/i,
        /auth[_-]?key\s*[:=]\s*['"]/i
      ];

      suspiciousPatterns.forEach((pattern) => {
        if (pattern.test(content)) {
          this.addIssue({
            severity: 'critical',
            category: 'data-exposure',
            message: 'Potential credential exposure in client-side code',
            recommendation: 'Move all sensitive data to environment variables and server-side code'
          });
        }
      });
    });
  }

  private static checkInsecureStorage(): void {
    try {
      // Check localStorage for sensitive data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && this.isSensitiveStorageKey(key)) {
          const value = localStorage.getItem(key);
          if (value && !this.isEncrypted(value)) {
            this.addIssue({
              severity: 'high',
              category: 'data-exposure',
              message: `Sensitive data stored insecurely in localStorage: ${key}`,
              recommendation: 'Encrypt sensitive data or use secure storage methods'
            });
          }
        }
      }

      // Check sessionStorage for sensitive data
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && this.isSensitiveStorageKey(key)) {
          const value = sessionStorage.getItem(key);
          if (value && !this.isEncrypted(value)) {
            this.addIssue({
              severity: 'medium',
              category: 'data-exposure',
              message: `Sensitive data stored insecurely in sessionStorage: ${key}`,
              recommendation: 'Consider using secure token storage or encryption'
            });
          }
        }
      }
    } catch (error) {
      console.warn('Storage access check failed:', error);
    }
  }

  private static checkExternalLinks(): void {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith(window.location.origin)) {
        const hasTargetBlank = link.getAttribute('target') === '_blank';
        const rel = link.getAttribute('rel') || '';
        const hasNoopener = rel.includes('noopener');
        const hasNoreferrer = rel.includes('noreferrer');
        
        if (hasTargetBlank && (!hasNoopener || !hasNoreferrer)) {
          this.addIssue({
            severity: 'medium',
            category: 'data-exposure',
            message: 'External link missing security attributes',
            recommendation: 'Add rel="noopener noreferrer" to external links with target="_blank"',
            element: link
          });
        }
      }
    });
  }

  private static checkFormSecurity(): void {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      // Check for forms without CSRF protection
      const hasCSRFToken = form.querySelector('input[name*="csrf"], input[name*="token"]');
      if (!hasCSRFToken && form.method?.toLowerCase() === 'post') {
        this.addIssue({
          severity: 'high',
          category: 'csrf',
          message: 'Form missing CSRF protection',
          recommendation: 'Add CSRF tokens to all forms that modify data',
          element: form
        });
      }

      // Check for password fields without autocomplete="new-password"
      const passwordFields = form.querySelectorAll('input[type="password"]');
      passwordFields.forEach((field) => {
        const autocomplete = field.getAttribute('autocomplete');
        if (!autocomplete || !['new-password', 'current-password'].includes(autocomplete)) {
          this.addIssue({
            severity: 'low',
            category: 'authentication',
            message: 'Password field missing proper autocomplete attribute',
            recommendation: 'Add autocomplete="new-password" or "current-password" to password fields'
          });
        }
      });
    });
  }

  private static checkContentSecurityPolicy(): void {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
      this.addIssue({
        severity: 'high',
        category: 'content-security',
        message: 'No Content Security Policy detected',
        recommendation: 'Implement a strict Content Security Policy to prevent XSS attacks'
      });
    }
  }

  private static checkMixedContent(): void {
    if (window.location.protocol === 'https:') {
      const httpResources = document.querySelectorAll('[src^="http:"], [href^="http:"]');
      if (httpResources.length > 0) {
        this.addIssue({
          severity: 'medium',
          category: 'content-security',
          message: `${httpResources.length} HTTP resources found on HTTPS page`,
          recommendation: 'Ensure all resources use HTTPS to prevent mixed content warnings'
        });
      }
    }
  }

  private static checkClickjackingProtection(): void {
    // Check for X-Frame-Options or CSP frame-ancestors
    const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const hasFrameProtection = frameOptions || (csp && csp.getAttribute('content')?.includes('frame-ancestors'));
    
    if (!hasFrameProtection) {
      this.addIssue({
        severity: 'medium',
        category: 'content-security',
        message: 'No clickjacking protection detected',
        recommendation: 'Add X-Frame-Options header or CSP frame-ancestors directive'
      });
    }
  }

  private static isSensitiveStorageKey(key: string): boolean {
    const sensitiveKeywords = [
      'password', 'token', 'secret', 'key', 'auth', 'session',
      'credit', 'card', 'ssn', 'social', 'account', 'banking'
    ];
    return sensitiveKeywords.some(keyword => key.toLowerCase().includes(keyword));
  }

  private static isEncrypted(value: string): boolean {
    // Simple check for encrypted data (could be improved)
    return value.startsWith('encrypted:') || 
           value.startsWith('enc:') || 
           /^[A-Za-z0-9+/=]{40,}$/.test(value); // Base64-like pattern
  }

  private static generateRecommendations(): string[] {
    const recommendations = [
      'Implement Content Security Policy (CSP) headers',
      'Use HTTPS for all resources and communications',
      'Sanitize all user inputs before displaying',
      'Implement proper authentication and session management',
      'Add CSRF protection to all forms',
      'Use secure storage methods for sensitive data',
      'Regularly update dependencies for security patches',
      'Implement proper error handling without exposing sensitive information'
    ];

    // Add specific recommendations based on found issues
    const hasXSSIssues = this.issues.some(i => i.category === 'xss');
    if (hasXSSIssues) {
      recommendations.unshift('URGENT: Fix XSS vulnerabilities immediately');
    }

    const hasCredentialExposure = this.issues.some(i => i.category === 'data-exposure' && i.severity === 'critical');
    if (hasCredentialExposure) {
      recommendations.unshift('CRITICAL: Remove exposed credentials from client-side code');
    }

    return recommendations;
  }

  private static addIssue(issue: SecurityIssue): void {
    this.issues.push(issue);
  }

  static logSecurityReport(): void {
    const report = this.generateSecurityReport();
    
    console.group(`🔒 Security Report (Score: ${report.score}/100)`);
    
    if (report.issues.length === 0) {
      console.log('✅ No security issues detected');
    } else {
      console.warn(`Found ${report.issues.length} security issues:`);
      console.warn(`Critical: ${report.criticalCount}, High: ${report.highCount}`);
      
      report.issues.forEach((issue, index) => {
        const icon = issue.severity === 'critical' ? '🔴' : 
                     issue.severity === 'high' ? '🟠' : 
                     issue.severity === 'medium' ? '🟡' : '🟢';
        
        console.log(`${icon} ${index + 1}. [${issue.category.toUpperCase()}] ${issue.message}`);
        console.log(`   💡 ${issue.recommendation}`);
      });

      console.group('📋 Recommendations:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
    return report;
  }
}
