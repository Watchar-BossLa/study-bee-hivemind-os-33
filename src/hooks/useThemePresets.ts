
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { toast } from '@/hooks/use-toast';

export type ThemePreset = {
  id: string;
  name: string;
  baseTheme: 'light' | 'dark';
  colors: Record<string, string>;
  fontFamily?: string;
  fontScale?: number;
  reduceMotion?: boolean;
  createdAt: number;
};

export function useThemePresets() {
  const { setTheme, setCustomStyles } = useTheme();
  const [presets, setPresets] = useState<ThemePreset[]>([]);

  // Load saved presets on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem('study-bee-theme-presets');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error('Failed to load theme presets', e);
      }
    }
  }, []);

  // Save presets when they change
  useEffect(() => {
    if (presets.length > 0) {
      localStorage.setItem('study-bee-theme-presets', JSON.stringify(presets));
    }
  }, [presets]);

  const savePreset = (preset: Omit<ThemePreset, 'id' | 'createdAt'>) => {
    const newPreset: ThemePreset = {
      ...preset,
      id: `preset_${Date.now()}`,
      createdAt: Date.now(),
    };

    setPresets(prev => [newPreset, ...prev]);
    
    toast({
      title: 'Theme preset saved',
      description: `"${preset.name}" has been saved to your presets.`,
    });

    return newPreset;
  };

  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) {
      toast({
        title: 'Error',
        description: 'Theme preset not found',
        variant: 'destructive',
      });
      return false;
    }

    // Apply base theme
    setTheme(preset.baseTheme);
    
    // Apply custom colors
    setCustomStyles(preset.colors);
    
    // Apply other settings if available
    if (preset.fontFamily) {
      document.documentElement.style.setProperty('--font-family', preset.fontFamily);
    }

    if (preset.fontScale) {
      document.documentElement.style.setProperty('--font-scale', preset.fontScale.toString());
    }

    toast({
      title: 'Theme preset applied',
      description: `"${preset.name}" has been applied to your interface.`,
    });

    return true;
  };

  const deletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
    
    toast({
      title: 'Theme preset deleted',
      description: 'The theme preset has been removed.',
    });
  };

  return {
    presets,
    savePreset,
    applyPreset,
    deletePreset,
  };
}
