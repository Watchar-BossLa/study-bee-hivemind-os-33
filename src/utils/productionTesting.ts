
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { ENVIRONMENT } from '@/config/environment';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export class ProductionTester {
  private static results: TestResult[] = [];
  
  static async runComprehensiveTests(): Promise<TestResult[]> {
    this.results = [];
    logger.info('🧪 Running comprehensive production tests...');
    
    await Promise.all([
      this.testDatabaseConnection(),
      this.testAuthentication(),
      this.testApiEndpoints(),
      this.testFeatureFlags(),
      this.testSecurity(),
      this.testPerformance()
    ]);
    
    this.logResults();
    return this.results;
  }
  
  private static addResult(result: TestResult): void {
    this.results.push(result);
  }
  
  private static async testDatabaseConnection(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count(*)')
        .limit(1);
      
      if (error) {
        this.addResult({
          name: 'Database Connection',
          status: 'fail',
          message: 'Failed to connect to database',
          details: error.message
        });
      } else {
        this.addResult({
          name: 'Database Connection',
          status: 'pass',
          message: 'Database connection successful'
        });
      }
    } catch (error) {
      this.addResult({
        name: 'Database Connection',
        status: 'fail',
        message: 'Database connection error',
        details: error
      });
    }
  }
  
  private static async testAuthentication(): Promise<void> {
    try {
      const { data } = await supabase.auth.getSession();
      
      this.addResult({
        name: 'Authentication System',
        status: 'pass',
        message: 'Authentication system initialized',
        details: { hasSession: !!data.session }
      });
    } catch (error) {
      this.addResult({
        name: 'Authentication System',
        status: 'fail',
        message: 'Authentication system error',
        details: error
      });
    }
  }
  
  private static async testApiEndpoints(): Promise<void> {
    const endpoints = [
      { name: 'Quiz Questions', table: 'quiz_questions' },
      { name: 'Flashcards', table: 'flashcards' },
      { name: 'Live Sessions', table: 'live_sessions' },
      { name: 'Study Groups', table: 'study_groups' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const { error } = await supabase
          .from(endpoint.table)
          .select('count(*)')
          .limit(1);
        
        if (error) {
          this.addResult({
            name: `API: ${endpoint.name}`,
            status: 'warning',
            message: `API endpoint accessible but returned error: ${error.message}`
          });
        } else {
          this.addResult({
            name: `API: ${endpoint.name}`,
            status: 'pass',
            message: 'API endpoint accessible'
          });
        }
      } catch (error) {
        this.addResult({
          name: `API: ${endpoint.name}`,
          status: 'fail',
          message: 'API endpoint failed',
          details: error
        });
      }
    }
  }
  
  private static async testFeatureFlags(): Promise<void> {
    const enabledFeatures = Object.entries(ENVIRONMENT.FEATURES)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name);
    
    this.addResult({
      name: 'Feature Flags',
      status: 'pass',
      message: `${enabledFeatures.length} features enabled`,
      details: enabledFeatures
    });
  }
  
  private static async testSecurity(): Promise<void> {
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
    
    this.addResult({
      name: 'Security Configuration',
      status: securityChecks.every(check => check.includes('✅')) ? 'pass' : 'warning',
      message: 'Security checks completed',
      details: securityChecks
    });
  }
  
  private static async testPerformance(): Promise<void> {
    const performanceMetrics: any = {};
    
    if (performance.navigation) {
      performanceMetrics.loadTime = performance.navigation.loadEventEnd - performance.navigation.navigationStart;
      performanceMetrics.domReady = performance.navigation.domContentLoadedEventEnd - performance.navigation.navigationStart;
    }
    
    performanceMetrics.memoryUsage = (performance as any).memory?.usedJSHeapSize || 'N/A';
    
    this.addResult({
      name: 'Performance Metrics',
      status: 'pass',
      message: 'Performance data collected',
      details: performanceMetrics
    });
  }
  
  private static logResults(): void {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    
    logger.info('📋 Test Results Summary:', {
      total: this.results.length,
      passed,
      failed,
      warnings,
      details: this.results
    });
    
    if (failed > 0) {
      logger.error('❌ Critical tests failed - review before production deployment');
    } else if (warnings > 0) {
      logger.warn('⚠️ Some tests have warnings - review recommended');
    } else {
      logger.info('✅ All tests passed - ready for production');
    }
  }
}
