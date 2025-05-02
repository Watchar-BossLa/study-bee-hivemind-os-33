
import { useEffect } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

/**
 * Hook that triggers a callback whenever the theme changes
 * Useful for analytics, accessibility announcements, or syncing theme with backend preferences
 */
export function useThemeChange(callback: (theme: string, resolvedTheme: string) => void) {
  const { theme, resolvedTheme } = useTheme();
  
  useEffect(() => {
    // Call callback whenever theme or resolvedTheme changes
    callback(theme, resolvedTheme);
    
    // Announce theme change for screen readers if needed
    const announcer = document.getElementById('theme-change-announcer');
    if (announcer) {
      announcer.textContent = `Theme changed to ${theme === "dynamic" ? "dynamic " + resolvedTheme : theme}`;
    }
  }, [theme, resolvedTheme, callback]);
  
  return { theme, resolvedTheme };
}
