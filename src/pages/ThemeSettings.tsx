
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeDiagnostics } from '@/components/theme/ThemeDiagnostics';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useThemeSettings } from '@/hooks/useThemeSettings';
import { ThemeCustomizer } from '@/components/theme/ThemeCustomizer';
import { PaletteIcon, RepeatIcon } from 'lucide-react';

const ThemeSettings = (): React.ReactElement => {
  const [customizerOpen, setCustomizerOpen] = React.useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  const { resetSettings } = useThemeSettings();
  
  const handleResetSettings = (): void => {
    resetSettings();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Theme Settings</h1>
              <p className="text-muted-foreground mt-1">
                Customize your interface appearance and accessibility options
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleResetSettings}
              >
                <RepeatIcon size={16} />
                Reset to Default
              </Button>
              
              <Button 
                className="flex items-center gap-2"
                onClick={() => setCustomizerOpen(true)}
              >
                <PaletteIcon size={16} />
                Open Customizer
              </Button>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6">Preview</h2>
            
            <div className="grid gap-6">
              <div className={`p-6 border rounded-lg ${resolvedTheme === 'dark' ? 'bg-card' : 'bg-card'}`}>
                <h3 className="text-lg font-medium mb-3">Sample Content</h3>
                <p className="mb-4">This is a preview of how your content will look with the current theme settings.</p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/50">
                  <p className="text-sm text-muted-foreground">This is how your muted content would appear with current settings.</p>
                </div>
              </div>
            </div>
          </div>
          
          <ThemeDiagnostics />
        </div>
      </main>
      
      <Footer />
      
      <ThemeCustomizer 
        open={customizerOpen} 
        onOpenChange={setCustomizerOpen} 
      />
    </div>
  );
};

export default ThemeSettings;
