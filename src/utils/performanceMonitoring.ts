
interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export class PerformanceMonitor {
  private static metrics: Partial<PerformanceMetrics> = {};

  static init(): void {
    if (typeof window === 'undefined') return;

    // Observe Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.measureFCP();
    this.measureTTFB();
  }

  private static observeLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.reportMetrics();
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  private static observeFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'first-input') {
            this.metrics.fid = (entry as any).processingStart - entry.startTime;
            this.reportMetrics();
          }
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  private static observeCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        this.metrics.cls = clsValue;
        this.reportMetrics();
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private static measureFCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            this.reportMetrics();
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  private static measureTTFB(): void {
    if (performance.timing) {
      this.metrics.ttfb = performance.timing.responseStart - performance.timing.navigationStart;
    }
  }

  private static reportMetrics(): void {
    // In production, send to analytics service
    console.log('Performance Metrics:', this.metrics);
  }

  static getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  static measureComponentRender(componentName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      
      // Log slow components
      if (renderTime > 16) { // Slower than 60fps
        console.warn(`Slow component detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
    };
  }
}
