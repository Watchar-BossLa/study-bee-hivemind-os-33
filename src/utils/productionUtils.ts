
import { PRODUCTION_CONFIG, isProduction } from '@/config/production';
import { logger } from '@/utils/logger';

// Clean up debug artifacts for production
export const removeDebugArtifacts = (): void => {
  if (!isProduction()) return;

  // Remove debug panels and development tools
  const debugElements = document.querySelectorAll('[data-debug], [data-testid]');
  debugElements.forEach(el => el.remove());

  // Clear development-only localStorage items
  if (typeof window !== 'undefined') {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('debug-') || key.startsWith('dev-')) {
        localStorage.removeItem(key);
      }
    });
  }

  logger.info('Debug artifacts cleaned up for production');
};

// Production security headers
export const enforceProductionSecurity = (): void => {
  if (!isProduction()) return;

  // Disable right-click in production (optional)
  document.addEventListener('contextmenu', (e) => {
    if (isProduction()) {
      e.preventDefault();
    }
  });

  // Disable developer tools detection (basic)
  let devtools = { open: false };
  setInterval(() => {
    if (devtools.open) {
      logger.warn('Developer tools detected in production');
    }
  }, 1000);

  logger.info('Production security measures enforced');
};

// Service worker registration for caching
export const registerServiceWorker = async (): Promise<void> => {
  if (!isProduction() || !('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    logger.info('Service Worker registered successfully', registration);
  } catch (error) {
    logger.error('Service Worker registration failed', error);
  }
};
