
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, Laptop, Sparkles } from "lucide-react"
import { useTheme, type Theme } from "./ThemeProvider"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {theme === "dynamic" && (
            <Sparkles className={cn(
              "absolute h-[1.2rem] w-[1.2rem] transition-all",
              resolvedTheme === "dark" ? "opacity-100" : "opacity-0"
            )} />
          )}
          <span className="sr-only">Toggle theme</span>
          
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
