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
      root.classList.add(baseTheme, "dynamic") // Add both base theme and dynamic class
      setResolvedTheme(baseTheme)

      // Function to update theme based on time and system preference
      const checkTime = () => {
        const currentBaseTheme = getSystemTheme()
        // Keep the dynamic class but update the base theme class
        root.classList.remove("light", "dark")
        root.classList.add(currentBaseTheme)
        setResolvedTheme(currentBaseTheme)
      }

      // Initial check
      checkTime()
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => checkTime()
      
      // Use addEventListener with named function for proper cleanup
      mediaQuery.addEventListener("change", handleChange)

      // Check periodically for any time-based changes
      const interval = setInterval(checkTime, 60000) // Check every minute
      
      return () => {
        clearInterval(interval)
        mediaQuery.removeEventListener("change", handleChange)
      }
    } else {
      // Direct light or dark theme selection
      root.classList.add(theme)
      setResolvedTheme(theme)
    }
  }, [theme])

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
