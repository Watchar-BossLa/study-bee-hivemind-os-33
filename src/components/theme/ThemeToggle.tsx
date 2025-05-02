
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, Laptop, Sparkles, Palette } from "lucide-react"
import { useTheme, type Theme } from "./ThemeProvider"
import { ThemeCustomizer } from "./ThemeCustomizer"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [customizerOpen, setCustomizerOpen] = useState(false)

  // Map of theme icons and their colors
  const themeIcons = {
    light: <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />,
    dark: <Moon className="h-[1.2rem] w-[1.2rem] text-blue-500" />,
    system: <Laptop className="h-[1.2rem] w-[1.2rem] text-green-500" />,
    dynamic: <Sparkles className="h-[1.2rem] w-[1.2rem] text-purple-500" />
  }

  // Get appropriate icon based on current theme
  const renderIcon = () => {
    if (theme === 'dynamic') {
      return (
        <>
          {/* Show the base layer icon (either sun or moon) */}
          <Sun className={cn(
            "h-[1.2rem] w-[1.2rem] transition-all absolute",
            resolvedTheme === "dark" ? "opacity-0" : "opacity-100"
          )} />
          <Moon className={cn(
            "h-[1.2rem] w-[1.2rem] transition-all absolute",
            resolvedTheme === "dark" ? "opacity-100" : "opacity-0"
          )} />
          {/* Overlay the sparkles to indicate dynamic mode */}
          <Sparkles className="h-[1.2rem] w-[1.2rem] transition-all text-purple-500" />
        </>
      );
    }

    if (theme === 'light') return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    if (theme === 'dark') return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    
    // For system, show either sun or moon based on system preference
    return resolvedTheme === 'dark' 
      ? <Moon className="h-[1.2rem] w-[1.2rem]" />
      : <Sun className="h-[1.2rem] w-[1.2rem]" />;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="relative"
            aria-label={`Current theme: ${theme === 'dynamic' ? `dynamic ${resolvedTheme}` : theme}`}
          >
            <div className="relative flex items-center justify-center">
              {renderIcon()}
            </div>
            
            {/* Active theme indicator */}
            <span className={cn(
              "absolute top-0 right-0 flex h-2 w-2 rounded-full", 
              theme === "dynamic" ? "bg-gradient-to-r from-purple-400 to-pink-400" : 
              theme === "light" ? "bg-yellow-400" :
              theme === "dark" ? "bg-blue-400" : "bg-green-400"
            )} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
            <DropdownMenuRadioItem value="light" className="cursor-pointer">
              <Sun className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Light</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark" className="cursor-pointer">
              <Moon className="mr-2 h-4 w-4 text-blue-500" />
              <span>Dark</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system" className="cursor-pointer">
              <Laptop className="mr-2 h-4 w-4 text-green-500" />
              <span>System</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dynamic" className="cursor-pointer">
              <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
              <span>Dynamic</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setCustomizerOpen(true)}
          >
            <Palette className="mr-2 h-4 w-4 text-primary" />
            <span>Customize Theme</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ThemeCustomizer 
        open={customizerOpen} 
        onOpenChange={setCustomizerOpen} 
      />
    </>
  )
}
