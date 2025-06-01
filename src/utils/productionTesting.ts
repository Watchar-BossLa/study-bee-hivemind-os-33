
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
    
    await Promise.all([
      this.runDatabaseTests(),
      this.runAuthTests(),
      this.runSecurityTests(),
      this.runPerformanceTests(),
      this.runFeatureTests()
    ]);
    
    this.logResults();
    return this.results;
  }
  
  private static addResult(result: TestResult): void {
    this.results.push(result);
  }
  
  private static addResults(results: TestResult[]): void {
    this.results.push(...results);
  }
  
  private static async runDatabaseTests(): Promise<void> {
    const dbResult = await DatabaseTester.testDatabaseConnection();
    this.addResult(dbResult);
    
    const apiResults = await DatabaseTester.testApiEndpoints();
    this.addResults(apiResults);
  }
  
  private static async runAuthTests(): Promise<void> {
    const authResult = await AuthTester.testAuthentication();
    this.addResult(authResult);
  }
  
  private static async runSecurityTests(): Promise<void> {
    const securityResult = await SecurityTester.testSecurity();
    this.addResult(securityResult);
  }
  
  private static async runPerformanceTests(): Promise<void> {
    const performanceResult = await PerformanceTester.testPerformance();
    this.addResult(performanceResult);
  }
  
  private static async runFeatureTests(): Promise<void> {
    const featureResult = await FeatureTester.testFeatureFlags();
    this.addResult(featureResult);
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
