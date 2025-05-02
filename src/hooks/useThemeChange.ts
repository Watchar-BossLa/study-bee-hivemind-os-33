
import { useEffect } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

type ThemeChangeCallback = (theme: string, resolvedTheme: string, themeVersion: number) => void;

/**
 * Hook that triggers a callback whenever the theme changes
 * Useful for analytics, accessibility announcements, or syncing theme with backend preferences
 */
export function useThemeChange(callback: ThemeChangeCallback): { 
  theme: string; 
  resolvedTheme: string; 
  themeVersion: number;
} {
  const { theme, resolvedTheme, themeVersion } = useTheme();
  
  useEffect(() => {
    // Call callback whenever theme, resolvedTheme or themeVersion changes
    callback(theme, resolvedTheme, themeVersion);
    
    // Announce theme change for screen readers
    const announcer = document.getElementById('theme-change-announcer');
    if (announcer) {
      let announcement = `Theme changed to ${theme === "dynamic" ? "dynamic " + resolvedTheme : theme}`;
      
      // Add version info for detailed announcements when custom styles change
      if (themeVersion > 1) {
        announcement += ` with custom settings applied`;
      }
      
      announcer.textContent = announcement;
    }
    
    // Log theme changes for debugging
    console.log(`Theme changed: ${theme} (resolved: ${resolvedTheme}, version: ${themeVersion})`);
  }, [theme, resolvedTheme, themeVersion, callback]);
  
  return { theme, resolvedTheme, themeVersion };
}
