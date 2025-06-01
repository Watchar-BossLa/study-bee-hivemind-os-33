
import { logger } from '@/utils/logger';
import { DatabaseTester } from '@/utils/testing/DatabaseTester';
import { AuthTester } from '@/utils/testing/AuthTester';
import { SecurityTester } from '@/utils/testing/SecurityTester';
import { PerformanceTester } from '@/utils/testing/PerformanceTester';
import { FeatureTester } from '@/utils/testing/FeatureTester';

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
    
    // Run tests with proper error handling and sequencing
    try {
      await this.runAuthTests();
      await this.runDatabaseTests();
      await this.runSecurityTests();
      await this.runPerformanceTests();
      await this.runFeatureTests();
    } catch (error) {
      logger.error('Test suite encountered an error:', error);
      this.addResult({
        name: 'Test Suite',
        status: 'fail',
        message: 'Test suite execution failed',
        details: error
      });
    }
    
    this.logResults();
    return this.results;
  }
  
  private static addResult(result: TestResult): void {
    this.results.push(result);
  }
  
  private static addResults(results: TestResult[]): void {
    this.results.push(...results);
  }
  
  private static async runAuthTests(): Promise<void> {
    try {
      // Basic auth system test
      const authResult = await AuthTester.testAuthentication();
      this.addResult(authResult);
      
      // Comprehensive auth flow tests
      const authFlowResults = await AuthTester.testAuthFlow();
      this.addResults(authFlowResults);
      
      // Session persistence test
      const sessionResult = await AuthTester.testSessionPersistence();
      this.addResult(sessionResult);
    } catch (error) {
      this.addResult({
        name: 'Auth Tests',
        status: 'fail',
        message: 'Auth test suite failed',
        details: error
      });
    }
  }
  
  private static async runDatabaseTests(): Promise<void> {
    try {
      const dbResult = await DatabaseTester.testDatabaseConnection();
      this.addResult(dbResult);
      
      const apiResults = await DatabaseTester.testApiEndpoints();
      this.addResults(apiResults);
    } catch (error) {
      this.addResult({
        name: 'Database Tests',
        status: 'fail',
        message: 'Database test suite failed',
        details: error
      });
    }
  }
  
  private static async runSecurityTests(): Promise<void> {
    try {
      const securityResult = await SecurityTester.testSecurity();
      this.addResult(securityResult);
    } catch (error) {
      this.addResult({
        name: 'Security Tests',
        status: 'fail',
        message: 'Security test suite failed',
        details: error
      });
    }
  }
  
  private static async runPerformanceTests(): Promise<void> {
    try {
      const performanceResult = await PerformanceTester.testPerformance();
      this.addResult(performanceResult);
    } catch (error) {
      this.addResult({
        name: 'Performance Tests',
        status: 'fail',
        message: 'Performance test suite failed',
        details: error
      });
    }
  }
  
  private static async runFeatureTests(): Promise<void> {
    try {
      const featureResult = await FeatureTester.testFeatureFlags();
      this.addResult(featureResult);
    } catch (error) {
      this.addResult({
        name: 'Feature Tests',
        status: 'fail',
        message: 'Feature test suite failed',
        details: error
      });
    }
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
      successRate: Math.round((passed / this.results.length) * 100),
      details: this.results
    });
    
    if (failed > 0) {
      logger.error(`❌ ${failed} critical tests failed - review before production deployment`);
      this.results.filter(r => r.status === 'fail').forEach(result => {
        logger.error(`   • ${result.name}: ${result.message}`);
      });
    } else if (warnings > 0) {
      logger.warn(`⚠️ ${warnings} tests have warnings - review recommended`);
      this.results.filter(r => r.status === 'warning').forEach(result => {
        logger.warn(`   • ${result.name}: ${result.message}`);
      });
    } else {
      logger.info('✅ All tests passed - ready for production');
    }
  }
}
