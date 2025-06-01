
interface SecurityReport {
  contentSecurityPolicy: boolean;
  httpsEnforcement: boolean;
  formValidation: boolean;
  xssProtection: boolean;
  clickjackingProtection: boolean;
}

export class SecurityValidator {
  static validateContentSecurityPolicy(): boolean {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return !!cspMeta;
  }

  static validateHTTPSEnforcement(): boolean {
    return location.protocol === 'https:' || location.hostname === 'localhost';
  }

  static validateFormValidation(): boolean {
    const forms = document.querySelectorAll('form');
    return Array.from(forms).every(form => {
      const inputs = form.querySelectorAll('input[type="email"], input[type="url"]');
      return Array.from(inputs).every(input => 
        input.hasAttribute('required') || input.hasAttribute('pattern')
      );
    });
  }

  static validateXSSProtection(): boolean {
    // Check for dangerous innerHTML usage
    const scripts = document.querySelectorAll('script');
    return !Array.from(scripts).some(script => 
      script.innerHTML.includes('innerHTML') && 
      !script.innerHTML.includes('DOMPurify')
    );
  }

  static validateClickjackingProtection(): boolean {
    const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    return !!frameOptions || this.validateContentSecurityPolicy();
  }

  static generateSecurityReport(): SecurityReport {
    return {
      contentSecurityPolicy: this.validateContentSecurityPolicy(),
      httpsEnforcement: this.validateHTTPSEnforcement(),
      formValidation: this.validateFormValidation(),
      xssProtection: this.validateXSSProtection(),
      clickjackingProtection: this.validateClickjackingProtection()
    };
  }

  static logSecurityReport(): void {
    const report = this.generateSecurityReport();
    const issues = Object.entries(report).filter(([_, passing]) => !passing);
    
    if (issues.length === 0) {
      console.log('🔒 All security checks passed');
      return;
    }

    console.group('🔐 Security Validation Report');
    issues.forEach(([check, _]) => {
      console.warn(`❌ ${check} check failed`);
    });
    console.groupEnd();
  }
}
