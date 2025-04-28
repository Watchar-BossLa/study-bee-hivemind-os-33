
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system" | "dynamic"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
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

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark", "dynamic")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else if (theme === "dynamic") {
      const baseTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(baseTheme, "dynamic")

      const checkTime = () => {
        const currentBaseTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        root.classList.remove("light", "dark")
        root.classList.add(currentBaseTheme)
      }

      // Initial check
      checkTime()
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", checkTime)

      const interval = setInterval(checkTime, 60000) // Check every minute
      
      return () => {
        clearInterval(interval)
        mediaQuery.removeEventListener("change", checkTime)
      }
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const value = {
    theme,
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
