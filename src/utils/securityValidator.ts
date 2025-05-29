
interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'xss' | 'csrf' | 'data-exposure' | 'authentication' | 'authorization';
  message: string;
  recommendation: string;
}

export class SecurityValidator {
  private static issues: SecurityIssue[] = [];

  static validateCodeSecurity(): SecurityIssue[] {
    this.issues = [];
    
    this.checkDangerouslySetInnerHTML();
    this.checkExposedCredentials();
    this.checkInsecureStorage();
    this.checkExternalLinks();
    
    return this.issues;
  }

  private static checkDangerouslySetInnerHTML(): void {
    // This would typically run during build time or code analysis
    // For runtime, we can check if any elements have been set with innerHTML
    const elements = document.querySelectorAll('*');
    elements.forEach((element) => {
      if (element.innerHTML.includes('<script>') || element.innerHTML.includes('javascript:')) {
        this.addIssue({
          severity: 'critical',
          category: 'xss',
          message: 'Potential XSS vulnerability detected in innerHTML',
          recommendation: 'Use textContent or sanitize HTML input'
        });
      }
    });
  }

  private static checkExposedCredentials(): void {
    // Check for exposed credentials in code (simplified check)
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script) => {
      const content = script.textContent || '';
      if (content.includes('password') || content.includes('api_key') || content.includes('secret')) {
        this.addIssue({
          severity: 'high',
          category: 'data-exposure',
          message: 'Potential credential exposure in client-side code',
          recommendation: 'Move sensitive data to environment variables'
        });
      }
    });
  }

  private static checkInsecureStorage(): void {
    // Check localStorage and sessionStorage for sensitive data
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('password') || key.includes('token') || key.includes('secret'))) {
          const value = localStorage.getItem(key);
          if (value && !value.startsWith('encrypted:')) {
            this.addIssue({
              severity: 'medium',
              category: 'data-exposure',
              message: `Sensitive data stored insecurely in localStorage: ${key}`,
              recommendation: 'Encrypt sensitive data or use secure storage methods'
            });
          }
        }
      }
    } catch (error) {
      // Handle storage access errors
    }
  }

  private static checkExternalLinks(): void {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith(window.location.origin)) {
        const hasTargetBlank = link.getAttribute('target') === '_blank';
        const hasNoopener = link.getAttribute('rel')?.includes('noopener');
        const hasNoreferrer = link.getAttribute('rel')?.includes('noreferrer');
        
        if (hasTargetBlank && (!hasNoopener || !hasNoreferrer)) {
          this.addIssue({
            severity: 'medium',
            category: 'data-exposure',
            message: 'External link missing security attributes',
            recommendation: 'Add rel="noopener noreferrer" to external links with target="_blank"'
          });
        }
      }
    });
  }

  private static addIssue(issue: SecurityIssue): void {
    this.issues.push(issue);
  }

  static logSecurityReport(): void {
    const issues = this.validateCodeSecurity();
    
    if (issues.length === 0) {
      console.log('🔒 No security issues detected');
      return;
    }
    
    console.group('🚨 Security Issues Detected:');
    issues.forEach((issue, index) => {
      const icon = issue.severity === 'critical' ? '🔴' : 
                   issue.severity === 'high' ? '🟠' : 
                   issue.severity === 'medium' ? '🟡' : '🟢';
      
      console.log(`${icon} ${index + 1}. [${issue.category.toUpperCase()}] ${issue.message}`);
      console.log(`   💡 ${issue.recommendation}`);
    });
    console.groupEnd();
  }
}
