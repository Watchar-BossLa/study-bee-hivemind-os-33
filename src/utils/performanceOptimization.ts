
import { PRODUCTION_CONFIG } from '@/config/production';

// Resource preloading for critical assets
export const preloadCriticalResources = (): void => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  fontPreload.as = 'style';
  document.head.appendChild(fontPreload);

  // Preload critical images
  const logoPreload = document.createElement('link');
  logoPreload.rel = 'preload';
  logoPreload.href = '/favicon.ico';
  logoPreload.as = 'image';
  document.head.appendChild(logoPreload);
};

// Component optimization utilities
export const withPerformanceLogging = <T extends (...args: any[]) => any>(
  fn: T,
  componentName: string
): T => {
  if (!PRODUCTION_CONFIG.enablePerformanceMonitoring) return fn;

  return ((...args: any[]) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    if (end - start > 16) { // Slower than 60fps
      console.warn(`Performance: ${componentName} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
};

// Memory cleanup utilities
export const cleanupResources = (): void => {
  // Clear any cached data that's no longer needed
  if (typeof window !== 'undefined' && 'caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('old-') || name.includes('temp-')) {
          caches.delete(name);
        }
      });
    });
  }
};
