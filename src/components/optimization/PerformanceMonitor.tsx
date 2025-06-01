
import React, { useEffect } from 'react';
import { PRODUCTION_CONFIG } from '@/config/production';
import { logger } from '@/utils/logger';

interface PerformanceMonitorProps {
  children: React.ReactNode;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ children }) => {
  useEffect(() => {
    if (!PRODUCTION_CONFIG.enablePerformanceMonitoring) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          logger.info('Navigation timing', {
            loadTime: navEntry.loadEventEnd - navEntry.navigationStart,
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.navigationStart,
            firstPaint: navEntry.responseEnd - navEntry.navigationStart
          });
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          logger.info('LCP', { value: entry.startTime });
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint'] });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};
