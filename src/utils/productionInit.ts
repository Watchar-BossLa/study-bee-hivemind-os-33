
import { ENVIRONMENT, validateEnvironment, isProduction } from '@/config/environment';
import { ContentSecurityPolicy } from '@/utils/contentSecurityPolicy';
import { SecurityValidator } from '@/utils/securityValidator';
import { AccessibilityChecker } from '@/utils/accessibilityChecker';
import { initProductionSentry } from '@/services/monitoring/productionSentry';
import { logger } from '@/utils/logger';

export class ProductionInitializer {
  static async initialize(): Promise<void> {
    try {
      logger.info('🚀 Initializing production systems...');
      
      // Step 1: Validate environment
      validateEnvironment();
      
      // Step 2: Initialize monitoring
      if (ENVIRONMENT.ENABLE_ERROR_TRACKING) {
        initProductionSentry();
      }
      
      // Step 3: Set up security
      if (ENVIRONMENT.ENABLE_CSP) {
        ContentSecurityPolicy.injectCSP();
        ContentSecurityPolicy.setupCSPReporting();
      }
      
      // Step 4: Security validation
      if (ENVIRONMENT.ENABLE_SECURITY_HEADERS) {
        setTimeout(() => {
          SecurityValidator.logSecurityReport();
        }, 1000);
      }
      
      // Step 5: Accessibility checks (development only)
      if (!isProduction()) {
        setTimeout(() => {
          AccessibilityChecker.logIssues();
        }, 2000);
      }
      
      // Step 6: Performance monitoring
      if (ENVIRONMENT.ENABLE_PERFORMANCE_MONITORING) {
        this.initPerformanceMonitoring();
      }
      
      logger.info('✅ Production initialization complete');
      
    } catch (error) {
      logger.error('❌ Production initialization failed:', error);
      throw error;
    }
  }
  
  private static initPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
    
    // Monitor bundle size
    if (isProduction()) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            logger.info('Page load performance:', {
              loadTime: entry.duration,
              domContentLoaded: (entry as PerformanceNavigationTiming).domContentLoadedEventEnd
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }
  
  static logSystemStatus(): void {
    logger.info('📊 System Status:', {
      environment: ENVIRONMENT.NODE_ENV,
      version: ENVIRONMENT.APP_VERSION,
      features: Object.entries(ENVIRONMENT.FEATURES)
        .filter(([_, enabled]) => enabled)
        .map(([name]) => name),
      timestamp: new Date().toISOString()
    });
  }
}
