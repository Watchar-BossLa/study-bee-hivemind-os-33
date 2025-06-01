
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
    
    // Check CSP
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (csp) {
      securityChecks.push('CSP ✅');
    } else {
      securityChecks.push('CSP ❌');
    }
    
    return {
      name: 'Security Configuration',
      status: securityChecks.every(check => check.includes('✅')) ? 'pass' : 'warning',
      message: 'Security checks completed',
      details: securityChecks
    };
  }
}
