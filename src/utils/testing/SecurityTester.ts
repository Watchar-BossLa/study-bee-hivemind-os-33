
interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export class SecurityTester {
  static async testSecurity(): Promise<TestResult> {
    const securityChecks = [];
    
    // Check HTTPS
    if (location.protocol === 'https:' || location.hostname === 'localhost') {
      securityChecks.push('HTTPS ✅');
    } else {
      securityChecks.push('HTTPS ❌');
    }
    
    // Check CSP - look for both meta tag and programmatically set headers
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const cspHeader = document.querySelector('meta[name="csp-nonce"]'); // Check for programmatic CSP
    
    if (cspMeta || cspHeader) {
      securityChecks.push('CSP ✅');
    } else {
      // Check if CSP was set programmatically by looking for CSP violations handler
      const hasCSPHandler = window.addEventListener && 
        document.addEventListener.toString().includes('securitypolicyviolation');
      
      if (hasCSPHandler) {
        securityChecks.push('CSP ✅ (Programmatic)');
      } else {
        securityChecks.push('CSP ❌');
      }
    }
    
    // Check for security headers via meta tags
    const xFrameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    if (xFrameOptions) {
      securityChecks.push('X-Frame-Options ✅');
    } else {
      securityChecks.push('X-Frame-Options ⚠️');
    }
    
    // Check for secure cookies (if any)
    const hasSecureCookies = document.cookie.includes('Secure') || document.cookie.length === 0;
    if (hasSecureCookies) {
      securityChecks.push('Secure Cookies ✅');
    } else {
      securityChecks.push('Secure Cookies ⚠️');
    }
    
    const passedChecks = securityChecks.filter(check => check.includes('✅')).length;
    const totalChecks = securityChecks.length;
    
    return {
      name: 'Security Configuration',
      status: passedChecks === totalChecks ? 'pass' : 
              passedChecks >= totalChecks * 0.75 ? 'warning' : 'fail',
      message: `${passedChecks}/${totalChecks} security checks passed`,
      details: securityChecks
    };
  }
}
