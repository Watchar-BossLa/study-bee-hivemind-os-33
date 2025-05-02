
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookmarkPlus, 
  Check, 
  Download, 
  Save, 
  Share2, 
  Trash2,
  Sparkles 
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemePresets, ThemePreset } from '@/hooks/useThemePresets';
import { useThemeSettings } from '@/hooks/useThemeSettings';
import { toast } from '@/hooks/use-toast';

export function ThemePresets() {
  const [newPresetName, setNewPresetName] = React.useState('');
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const { theme, customStyles } = useTheme();
  const { settings } = useThemeSettings();
  const { presets, savePreset, applyPreset, deletePreset } = useThemePresets();
  
  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your theme preset",
        variant: "destructive",
      });
      return;
    }
    
    savePreset({
      name: newPresetName,
      baseTheme: theme as 'light' | 'dark',
      colors: customStyles || {},
      fontFamily: settings.fontFamily,
      fontScale: settings.fontScale,
      reduceMotion: settings.reduceMotion !== 'off',
    });
    
    setNewPresetName('');
    setSaveDialogOpen(false);
  };

  const handleSharePreset = (preset: ThemePreset) => {
    // Convert preset to JSON string
    const presetData = JSON.stringify(preset);
    // Encode for URL safety
    const encodedData = encodeURIComponent(presetData);
    // Create share URL
    const shareUrl = `${window.location.origin}?themePreset=${encodedData}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Share link copied",
          description: "Theme preset share link copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Failed to copy share link:', err);
        toast({
          title: "Failed to copy",
          description: "Could not copy share link to clipboard",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">Theme Presets</h3>
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BookmarkPlus size={16} />
              <span>Save Current</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Theme Preset</DialogTitle>
              <DialogDescription>
                Save your current theme settings as a preset for future use.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="preset-name">Preset Name</Label>
                <Input
                  id="preset-name"
                  placeholder="My Awesome Theme"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePreset}>
                <Save size={16} className="mr-2" />
                Save Preset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {presets.length > 0 ? (
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-3">
            {presets.map((preset) => (
              <Card key={preset.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-sm">{preset.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {preset.baseTheme.charAt(0).toUpperCase() + preset.baseTheme.slice(1)} theme
                    {preset.fontFamily ? ` • Custom font` : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pb-0">
                  <div className="flex gap-1 mb-2">
                    {Object.values(preset.colors).slice(0, 6).map((color, i) => (
                      <div 
                        key={i}
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost"
                      size="icon" 
                      onClick={() => deletePreset(preset.id)}
                      title="Delete preset"
                    >
                      <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleSharePreset(preset)}
                      title="Share preset"
                    >
                      <Share2 size={16} className="text-muted-foreground" />
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => applyPreset(preset.id)}
                    className="flex items-center gap-1"
                  >
                    <Download size={14} />
                    Apply
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px] bg-muted/30 rounded-md p-8 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
          <h4 className="text-md font-medium mb-2">No saved presets yet</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Customize your theme and save it as a preset for quick access later.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSaveDialogOpen(true)}
          >
            <BookmarkPlus size={16} className="mr-2" />
            Save Current Theme
          </Button>
        </div>
      )}
    </div>
  );
}
