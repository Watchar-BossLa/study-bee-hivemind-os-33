
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

export type ThemeSettings = {
  fontFamily: string;
  fontScale: number;
  animationSpeed: number;
  contrastLevel: number;
  colorPalette: string;
  reduceMotion: 'off' | 'subtle' | 'strong';
};

const defaultSettings: ThemeSettings = {
  fontFamily: 'system-ui, sans-serif',
  fontScale: 1,
  animationSpeed: 1,
  contrastLevel: 1,
  colorPalette: 'Default',
  reduceMotion: 'off',
};

interface UseThemeSettingsReturn {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  resetSettings: () => void;
}

export function useThemeSettings(): UseThemeSettingsReturn {
  const { theme } = useTheme();
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    // Try to load settings from localStorage on initial load
    const savedSettings = localStorage.getItem('study-bee-theme-settings');
    return savedSettings ? JSON.parse(savedSettings) as ThemeSettings : defaultSettings;
  });

  // Apply settings to DOM whenever they change
  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('study-bee-theme-settings', JSON.stringify(settings));
    
    // Apply font family
    document.documentElement.style.setProperty('--font-family', settings.fontFamily);
    
    // Apply font scale
    document.documentElement.style.setProperty('--font-scale', settings.fontScale.toString());
    
    // Apply animation speed
    document.documentElement.style.setProperty('--animation-speed', `${settings.animationSpeed}s`);
    
    // Set reduced motion based on setting
    if (settings.reduceMotion !== 'off') {
      document.documentElement.classList.add('reduce-motion');
      document.documentElement.classList.toggle('reduce-motion-strong', settings.reduceMotion === 'strong');
    } else {
      document.documentElement.classList.remove('reduce-motion', 'reduce-motion-strong');
    }
    
    // Log changes for debugging
    console.log('Applied theme settings:', settings);
    
  }, [settings, theme]);

  return {
    settings,
    updateSettings: (newSettings: Partial<ThemeSettings>): void => {
      setSettings(prev => ({ ...prev, ...newSettings }));
    },
    resetSettings: (): void => {
      setSettings(defaultSettings);
    }
  };
}
