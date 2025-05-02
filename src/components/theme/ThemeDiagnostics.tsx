
import React from 'react';
import { useTheme } from './ThemeProvider';
import { useThemeSettings } from '@/hooks/useThemeSettings';
import { useThemePresets } from '@/hooks/useThemePresets';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InfoIcon } from 'lucide-react';

export function ThemeDiagnostics() {
  const { theme, resolvedTheme, customStyles, themeVersion } = useTheme();
  const { settings } = useThemeSettings();
  const { presets } = useThemePresets();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Diagnostics</CardTitle>
        <CardDescription>Technical details about your current theme settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Current Theme Mode</Label>
                <div className="text-lg font-medium">{theme}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Resolved Theme</Label>
                <div className="text-lg font-medium">{resolvedTheme}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Theme Version</Label>
                <div className="text-lg font-medium">{themeVersion}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Font Family</Label>
                <div className="text-lg font-medium" style={{ fontFamily: settings.fontFamily }}>
                  {settings.fontFamily.split(',')[0]}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Font Scale</Label>
                <div className="text-lg font-medium">{settings.fontScale}×</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Animation Speed</Label>
                <div className="text-lg font-medium">{settings.animationSpeed}×</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Reduce Motion</Label>
                <div className="text-lg font-medium capitalize">{settings.reduceMotion}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Contrast Level</Label>
                <div className="text-lg font-medium">{settings.contrastLevel}×</div>
              </div>
            </div>
            
            <div className="mt-6 flex items-start gap-2 p-3 bg-muted/30 rounded-md">
              <InfoIcon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p>Theme diagnostics can help you troubleshoot issues with your theme settings. If you're having problems with the appearance of the application, these details can help identify the cause.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {customStyles && Object.entries(customStyles).map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-muted-foreground">{key}</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-5 w-5 rounded-full border"
                          style={{ backgroundColor: value }}
                        />
                        <code className="text-sm">{value}</code>
                      </div>
                    </div>
                  ))}
                  
                  {!customStyles || Object.keys(customStyles).length === 0 && (
                    <div className="col-span-2 text-muted-foreground">
                      No custom colors applied.
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Color Samples</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-4 bg-background border rounded-md text-center">background</div>
                    <div className="p-4 bg-foreground text-background rounded-md text-center">foreground</div>
                    <div className="p-4 bg-primary text-primary-foreground rounded-md text-center">primary</div>
                    <div className="p-4 bg-secondary text-secondary-foreground rounded-md text-center">secondary</div>
                    <div className="p-4 bg-accent text-accent-foreground rounded-md text-center">accent</div>
                    <div className="p-4 bg-muted text-muted-foreground rounded-md text-center">muted</div>
                    <div className="p-4 bg-destructive text-destructive-foreground rounded-md text-center">destructive</div>
                    <div className="p-4 bg-card text-card-foreground rounded-md text-center">card</div>
                    <div className="p-4 border rounded-md text-center">border</div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="presets" className="mt-4">
            {presets.length > 0 ? (
              <div className="space-y-4">
                <Label className="text-muted-foreground">Saved Presets ({presets.length})</Label>
                <ScrollArea className="h-[250px]">
                  <div className="space-y-4">
                    {presets.map((preset) => (
                      <div key={preset.id} className="border rounded-md p-3">
                        <h4 className="font-medium">{preset.name}</h4>
                        <div className="text-sm text-muted-foreground mt-1">
                          Base: {preset.baseTheme} • 
                          Created: {new Date(preset.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-1 mt-2">
                          {Object.values(preset.colors).slice(0, 6).map((color, i) => (
                            <div 
                              key={i}
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="text-muted-foreground">No saved presets.</div>
            )}
          </TabsContent>
          
          <TabsContent value="css" className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="font-mono text-xs">
                <pre className="p-4 bg-muted rounded-md">
                  {`/* Applied CSS Custom Properties */

:root {
  --font-family: ${settings.fontFamily};
  --font-scale: ${settings.fontScale};
  --animation-speed: ${settings.animationSpeed}s;
  ${customStyles ? Object.entries(customStyles).map(([key, value]) => `  --${key}: ${value};`).join('\n') : '  /* No custom colors */'}
}

.reduce-motion {
  --transition-duration: 0.15s;
}

.reduce-motion-strong {
  --transition-duration: 0s;
}`}
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
