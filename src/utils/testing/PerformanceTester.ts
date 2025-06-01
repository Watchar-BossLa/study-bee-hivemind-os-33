
interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export class PerformanceTester {
  static async testPerformance(): Promise<TestResult> {
    const performanceMetrics: any = {};
    
    // Use PerformanceNavigationTiming API
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        performanceMetrics.loadTime = Math.round(navigation.loadEventEnd - navigation.loadEventStart);
        performanceMetrics.domReady = Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        performanceMetrics.ttfb = Math.round(navigation.responseStart - navigation.requestStart);
      }
      
      // Memory usage (if available)
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        performanceMetrics.memoryUsed = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
        performanceMetrics.memoryTotal = Math.round(memory.totalJSHeapSize / 1024 / 1024); // MB
      }
      
      // Resource timing
      const resources = performance.getEntriesByType('resource');
      performanceMetrics.resourceCount = resources.length;
      
      // Evaluate performance
      let status: 'pass' | 'fail' | 'warning' = 'pass';
      let message = 'Performance metrics collected';
      
      if (performanceMetrics.loadTime > 3000) {
        status = 'warning';
        message = 'Page load time is slow (>3s)';
      } else if (performanceMetrics.loadTime > 5000) {
        status = 'fail';
        message = 'Page load time is very slow (>5s)';
      }
      
      return {
        name: 'Performance Metrics',
        status,
        message,
        details: performanceMetrics
      };
    }
    
    return {
      name: 'Performance Metrics',
      status: 'warning',
      message: 'Performance API not available',
      details: { browser: 'Performance API not supported' }
    };
  }
}
