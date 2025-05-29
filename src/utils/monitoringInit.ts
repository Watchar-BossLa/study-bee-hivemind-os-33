
import { PerformanceMonitor } from './performanceMonitoring';
import { AccessibilityChecker } from './accessibilityChecker';
import { SecurityValidator } from './securityValidator';

export class MonitoringInitializer {
  static init(): void {
    if (typeof window === 'undefined') return;

    // Initialize performance monitoring
    PerformanceMonitor.init();

    // Run accessibility checks in development
    if (process.env.NODE_ENV === 'development') {
      // Delay to ensure DOM is fully loaded
      setTimeout(() => {
        AccessibilityChecker.logIssues();
        SecurityValidator.logSecurityReport();
      }, 2000);
    }

    // Set up periodic checks
    this.setupPeriodicChecks();
  }

  private static setupPeriodicChecks(): void {
    // Check accessibility every 30 seconds in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        const issues = AccessibilityChecker.runBasicChecks();
        if (issues.length > 0) {
          console.warn(`🔍 Found ${issues.length} accessibility issues`);
        }
      }, 30000);
    }

    // Log performance metrics every minute
    setInterval(() => {
      const metrics = PerformanceMonitor.getMetrics();
      if (Object.keys(metrics).length > 0) {
        console.log('📊 Current Performance Metrics:', metrics);
      }
    }, 60000);
  }

  static runManualChecks(): void {
    console.group('🔍 Manual Quality Checks');
    AccessibilityChecker.logIssues();
    SecurityValidator.logSecurityReport();
    console.log('📊 Performance Metrics:', PerformanceMonitor.getMetrics());
    console.groupEnd();
  }
}

// Expose manual check function to window for debugging
if (typeof window !== 'undefined') {
  (window as any).runQualityChecks = MonitoringInitializer.runManualChecks;
}
