
"use client";

import * as React from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { toast } from "@/hooks/use-toast";
import { useThemeChange } from "@/hooks/useThemeChange";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [customizerOpen, setCustomizerOpen] = React.useState(false);

  // Use the hook to announce theme changes
  useThemeChange((theme, resolvedTheme, themeVersion) => {
    // This callback runs whenever theme changes
    console.log(`Theme changed to ${theme}, resolved as ${resolvedTheme}`);
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Toggle theme">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dynamic")}>
            Dynamic
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCustomizerOpen(true)}>
            <Palette className="mr-2 h-4 w-4" />
            Customize
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ThemeCustomizer open={customizerOpen} onOpenChange={setCustomizerOpen} />
    </>
  );
}
