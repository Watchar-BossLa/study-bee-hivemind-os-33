
import { PerformanceMonitor } from './performanceMonitoring';
import { AccessibilityChecker } from './accessibilityChecker';
import { SecurityValidator } from './securityValidator';
import { ContentSecurityPolicy } from './contentSecurityPolicy';
import { initProductionSentry } from '@/services/monitoring/productionSentry';
import { preloadCriticalResources, cleanupResources } from './performanceOptimization';
import { removeDebugArtifacts, enforceProductionSecurity, registerServiceWorker } from './productionUtils';
import { PRODUCTION_CONFIG } from '@/config/production';
import { logger } from './logger';

export class MonitoringInitializer {
  static init(): void {
    if (typeof window === 'undefined') return;

    // Initialize production monitoring
    if (PRODUCTION_CONFIG.enableSentry) {
      initProductionSentry();
    }

    // Initialize Content Security Policy
    ContentSecurityPolicy.injectCSP();
    ContentSecurityPolicy.setupCSPReporting();

    // Initialize performance monitoring
    PerformanceMonitor.init();
    preloadCriticalResources();

    // Production-specific initialization
    if (PRODUCTION_CONFIG.enableConsoleLogging === false) {
      removeDebugArtifacts();
      enforceProductionSecurity();
      registerServiceWorker();
    }

    // Run development checks only in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        AccessibilityChecker.logIssues();
        SecurityValidator.logSecurityReport();
      }, 2000);

      // Development-only periodic checks
      this.setupDevelopmentChecks();
    } else {
      // Production-only periodic checks
      this.setupProductionChecks();
    }

    logger.info('Monitoring systems initialized', { 
      environment: process.env.NODE_ENV,
      sentry: PRODUCTION_CONFIG.enableSentry 
    });
  }

  private static setupDevelopmentChecks(): void {
    // Check accessibility every 30 seconds in development
    setInterval(() => {
      const issues = AccessibilityChecker.runBasicChecks();
      if (issues.length > 0) {
        logger.warn(`Found ${issues.length} accessibility issues`);
      }
    }, 30000);

    // Log performance metrics every minute
    setInterval(() => {
      const metrics = PerformanceMonitor.getMetrics();
      if (Object.keys(metrics).length > 0) {
        logger.info('Performance Metrics', metrics);
      }
    }, 60000);
  }

  private static setupProductionChecks(): void {
    // Cleanup resources every 5 minutes in production
    setInterval(() => {
      cleanupResources();
    }, 300000);

    // Log critical metrics only
    setInterval(() => {
      const metrics = PerformanceMonitor.getMetrics();
      if (metrics.lcp && metrics.lcp > 2500) { // Poor LCP
        logger.warn('Poor LCP performance detected', { lcp: metrics.lcp });
      }
    }, 120000);
  }

  static runManualChecks(): void {
    if (process.env.NODE_ENV !== 'development') {
      logger.info('Manual checks only available in development');
      return;
    }

    console.group('🔍 Manual Quality Checks');
    AccessibilityChecker.logIssues();
    SecurityValidator.logSecurityReport();
    console.log('📊 Performance Metrics:', PerformanceMonitor.getMetrics());
    console.groupEnd();
  }
}

// Expose manual check function to window for debugging in development only
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).runQualityChecks = MonitoringInitializer.runManualChecks;
}
