
import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "light" | "dark" | "system" | "dynamic"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark" // Actual applied theme after system/dynamic resolution
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "study-bee-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const root = window.document.documentElement
    // First, remove all theme classes to start fresh
    root.classList.remove("light", "dark", "dynamic")

    // Helper to determine system preference
    const getSystemTheme = (): "light" | "dark" => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }

    // Apply theme based on selection
    if (theme === "system") {
      const systemTheme = getSystemTheme()
      root.classList.add(systemTheme)
      setResolvedTheme(systemTheme)
    } else if (theme === "dynamic") {
      // For dynamic mode, we first determine the base theme (light or dark)
      const baseTheme = getSystemTheme()
      // Important: Add baseTheme first, then dynamic
      // This ensures CSS rules for .dynamic.light or .dynamic.dark work correctly
      root.classList.add(baseTheme, "dynamic")
      setResolvedTheme(baseTheme)

      // Function to update theme based on system preference
      const updateDynamicTheme = () => {
        const currentBaseTheme = getSystemTheme()
        // Remove both light and dark classes first
        root.classList.remove("light", "dark")
        // Then add the current base theme while keeping "dynamic" class
        root.classList.add(currentBaseTheme)
        setResolvedTheme(currentBaseTheme)
      }

      // Initial check
      updateDynamicTheme()
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => updateDynamicTheme()
      
      mediaQuery.addEventListener("change", handleChange)

      // Cleanup
      return () => {
        mediaQuery.removeEventListener("change", handleChange)
      }
    } else {
      // Direct light or dark theme selection
      root.classList.add(theme)
      setResolvedTheme(theme)
    }

    // Add an accessibility announcement for screen readers
    const announcer = document.getElementById('theme-change-announcer') || (() => {
      const el = document.createElement('div')
      el.id = 'theme-change-announcer'
      el.setAttribute('aria-live', 'polite')
      document.body.appendChild(el)
      return el
    })()
    
    // Enhanced announcement that includes context for dynamic mode
    const announcementText = (theme as Theme) === "dynamic"
      ? `Theme changed to dynamic with ${resolvedTheme} base`
      : `Theme changed to ${theme}`;
    
    announcer.textContent = announcementText
  }, [theme, resolvedTheme])

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
