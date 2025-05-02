
import React, { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import { Palette, FileText, Sparkles, Sliders, CircleCheck, BookmarkIcon } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { ThemePresets } from "./ThemePresets"
import { useThemeSettings } from "@/hooks/useThemeSettings"

export type ColorPalette = {
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
}

const predefinedColorPalettes: ColorPalette[] = [
  {
    name: "Default",
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      primary: "var(--primary)",
      secondary: "var(--secondary)",
      accent: "var(--accent)",
      muted: "var(--muted)",
    },
  },
  {
    name: "Purple Dreams",
    colors: {
      background: "hsl(270, 50%, 98%)",
      foreground: "hsl(270, 10%, 10%)",
      primary: "hsl(270, 80%, 50%)",
      secondary: "hsl(290, 70%, 60%)",
      accent: "hsl(250, 60%, 70%)",
      muted: "hsl(270, 20%, 90%)",
    },
  },
  {
    name: "Ocean Breeze",
    colors: {
      background: "hsl(200, 60%, 98%)",
      foreground: "hsl(200, 10%, 10%)",
      primary: "hsl(200, 80%, 50%)",
      secondary: "hsl(180, 70%, 50%)",
      accent: "hsl(220, 60%, 70%)",
      muted: "hsl(200, 20%, 90%)",
    },
  },
  {
    name: "Forest Green",
    colors: {
      background: "hsl(120, 40%, 98%)",
      foreground: "hsl(120, 10%, 10%)",
      primary: "hsl(120, 60%, 40%)",
      secondary: "hsl(140, 50%, 50%)",
      accent: "hsl(100, 60%, 70%)",
      muted: "hsl(120, 20%, 90%)",
    },
  },
]

const fontOptions = [
  { name: "System", value: "system-ui, sans-serif" },
  { name: "Serif", value: "Georgia, serif" },
  { name: "Mono", value: "monospace" },
]

interface ThemeCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { settings, updateSettings } = useThemeSettings();
  const [selectedPalette, setSelectedPalette] = useState<string>("Default");
  const [selectedFont, setSelectedFont] = useState<string>(settings.fontFamily);
  const [fontScale, setFontScale] = useState<number[]>([settings.fontScale]);
  const [animationSpeed, setAnimationSpeed] = useState<number[]>([settings.animationSpeed]);
  const [contrastLevel, setContrastLevel] = useState<number[]>([settings.contrastLevel]);
  const [reduceMotion, setReduceMotion] = useState<string>(settings.reduceMotion);
  
  const handlePaletteChange = (paletteName: string) => {
    setSelectedPalette(paletteName);
    // In a real implementation, this would update the theme CSS variables
    
    // For now, we'll just show a toast notification
    toast({
      title: "Color palette updated",
      description: `Applied the ${paletteName} color palette.`,
    });
  };
  
  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    updateSettings({ fontFamily: font });
    
    toast({
      title: "Font updated",
      description: "Applied new font style to the interface.",
    });
  };
  
  const handleSaveTheme = () => {
    // Here we would save the complete theme configuration
    updateSettings({
      fontFamily: selectedFont,
      fontScale: fontScale[0],
      animationSpeed: animationSpeed[0],
      contrastLevel: contrastLevel[0],
      colorPalette: selectedPalette,
      reduceMotion: reduceMotion as 'off' | 'subtle' | 'strong',
    });
    
    toast({
      title: "Theme saved",
      description: "Your custom theme settings have been saved.",
      duration: 3000,
    });
    
    setTimeout(() => onOpenChange(false), 500);
  };
  
  const applyFontScale = (value: number[]) => {
    setFontScale(value);
    updateSettings({ fontScale: value[0] });
  };
  
  const applyAnimationSpeed = (value: number[]) => {
    setAnimationSpeed(value);
    updateSettings({ animationSpeed: value[0] });
  };
  
  const applyContrastLevel = (value: number[]) => {
    setContrastLevel(value);
    updateSettings({ contrastLevel: value[0] });
  };

  const handleReduceMotionChange = (value: string) => {
    if (!value) return;
    setReduceMotion(value);
    updateSettings({ reduceMotion: value as 'off' | 'subtle' | 'strong' });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette size={18} className="text-primary" /> Theme Customizer
          </SheetTitle>
          <SheetDescription>
            Customize your interface with colors, fonts, and accessibility options.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="colors" className="mt-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette size={16} />
              <span className="hidden sm:inline">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden sm:inline">Typography</span>
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Sparkles size={16} />
              <span className="hidden sm:inline">Effects</span>
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <BookmarkIcon size={16} />
              <span className="hidden sm:inline">Presets</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Base Mode</h3>
              <RadioGroup 
                defaultValue={theme} 
                onValueChange={(value) => setTheme(value as "light" | "dark" | "system" | "dynamic")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">System</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dynamic" id="dynamic" />
                  <Label htmlFor="dynamic">Dynamic</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-3">Color Palettes</h3>
              <div className="grid grid-cols-2 gap-2">
                {predefinedColorPalettes.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => handlePaletteChange(palette.name)}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-md border transition-all hover:shadow-md",
                      selectedPalette === palette.name && "border-primary ring-1 ring-primary"
                    )}
                  >
                    <div className="flex gap-1 mb-2">
                      {Object.values(palette.colors).map((color, i) => (
                        <div 
                          key={i}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium">{palette.name}</span>
                    {selectedPalette === palette.name && (
                      <CircleCheck size={16} className="text-primary mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="typography" className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Font Family</h3>
              <ToggleGroup 
                type="single" 
                value={selectedFont}
                onValueChange={(value) => {
                  if (value) handleFontChange(value);
                }}
                className="grid grid-cols-3 gap-2"
              >
                {fontOptions.map((font) => (
                  <ToggleGroupItem 
                    key={font.name} 
                    value={font.value}
                    className="text-center"
                  >
                    {font.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Font Size</h3>
                <span className="text-xs text-muted-foreground">{fontScale[0].toFixed(1)}×</span>
              </div>
              <Slider 
                value={fontScale}
                min={0.8}
                max={1.4}
                step={0.1}
                onValueChange={applyFontScale}
              />
              <div className="text-xs text-muted-foreground flex justify-between mt-1">
                <span>A</span>
                <span className="text-base">A</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="effects" className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Animation Speed</h3>
                <span className="text-xs text-muted-foreground">{animationSpeed[0].toFixed(1)}×</span>
              </div>
              <Slider 
                value={animationSpeed}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={applyAnimationSpeed}
              />
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Contrast Level</h3>
                <span className="text-xs text-muted-foreground">{contrastLevel[0].toFixed(1)}×</span>
              </div>
              <Slider 
                value={contrastLevel}
                min={0.8}
                max={1.5}
                step={0.1}
                onValueChange={applyContrastLevel}
              />
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Reduce Motion</h3>
              <ToggleGroup 
                type="single" 
                variant="outline" 
                className="grid grid-cols-3"
                value={reduceMotion}
                onValueChange={handleReduceMotionChange}
              >
                <ToggleGroupItem value="off">Off</ToggleGroupItem>
                <ToggleGroupItem value="subtle">Subtle</ToggleGroupItem>
                <ToggleGroupItem value="strong">Strong</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="mt-4">
            <ThemePresets />
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSaveTheme}>Save Theme</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
