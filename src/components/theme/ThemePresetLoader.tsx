
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useThemeSettings } from '@/hooks/useThemeSettings';
import { ThemePreset, useThemePresets } from '@/hooks/useThemePresets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';

export function ThemePresetLoader() {
  const location = useLocation();
  const { setTheme, setCustomStyles } = useTheme();
  const { updateSettings } = useThemeSettings();
  const { savePreset } = useThemePresets();
  const [sharedPreset, setSharedPreset] = useState<ThemePreset | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  
  useEffect(() => {
    // Extract theme preset from URL query parameter
    const params = new URLSearchParams(location.search);
    const presetParam = params.get('themePreset');
    
    if (presetParam) {
      try {
        const decodedData = decodeURIComponent(presetParam);
        const presetData = JSON.parse(decodedData) as ThemePreset;
        
        // Validate preset data structure
        if (presetData && 
            presetData.name && 
            presetData.baseTheme && 
            presetData.colors) {
          setSharedPreset(presetData);
          setAlertOpen(true);
        }
      } catch (err) {
        console.error('Failed to load theme preset from URL:', err);
        toast({
          title: "Invalid theme preset",
          description: "The shared theme preset could not be loaded",
          variant: "destructive",
        });
      }
      
      // Clean up the URL by removing the parameter
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [location, setTheme, setCustomStyles, updateSettings]);
  
  const handleApplyPreset = () => {
    if (!sharedPreset) return;
    
    // Apply base theme
    setTheme(sharedPreset.baseTheme);
    
    // Apply custom colors
    setCustomStyles(sharedPreset.colors);
    
    // Apply other settings if available
    if (sharedPreset.fontFamily) {
      updateSettings({ fontFamily: sharedPreset.fontFamily });
    }
    
    if (sharedPreset.fontScale) {
      updateSettings({ fontScale: sharedPreset.fontScale });
    }
    
    // Save the preset to user's collection
    savePreset({
      name: `${sharedPreset.name} (Shared)`,
      baseTheme: sharedPreset.baseTheme,
      colors: sharedPreset.colors,
      fontFamily: sharedPreset.fontFamily,
      fontScale: sharedPreset.fontScale,
      reduceMotion: sharedPreset.reduceMotion,
    });
    
    toast({
      title: "Theme applied",
      description: `Applied shared theme "${sharedPreset.name}" and saved to your presets`,
    });
    
    setAlertOpen(false);
  };
  
  if (!sharedPreset) {
    return null;
  }
  
  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apply shared theme?</AlertDialogTitle>
          <AlertDialogDescription>
            Someone shared the theme "{sharedPreset.name}" with you. Would you like to apply it to your interface?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Ignore</AlertDialogCancel>
          <AlertDialogAction onClick={handleApplyPreset}>Apply Theme</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
