
"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system" | "dynamic";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: string;
  setTheme: (theme: Theme) => void;
  themeVersion: number;
  customStyles: Record<string, string> | null;
  setCustomStyles: (styles: Record<string, string> | null) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "",
  setTheme: () => null,
  themeVersion: 1,
  customStyles: null,
  setCustomStyles: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "study-bee-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get the theme from local storage or use the default theme
    if (typeof localStorage !== "undefined") {
      const storedTheme = localStorage.getItem(storageKey);
      if (storedTheme && isValidTheme(storedTheme)) {
        return storedTheme as Theme;
      }
    }
    return defaultTheme;
  });

  // Custom styles storage
  const [customStyles, setCustomStylesState] = useState<Record<string, string> | null>(() => {
    const storedStyles = localStorage.getItem(storageKey + "-custom-styles");
    return storedStyles ? JSON.parse(storedStyles) : null;
  });

  // Theme version (increments when significant changes are made to the theme)
  const [themeVersion, setThemeVersion] = useState<number>(() => {
    const storedVersion = localStorage.getItem(storageKey + "-version");
    return storedVersion ? parseInt(storedVersion) : 1;
  });

  // Update local storage when the theme or custom styles change
  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  useEffect(() => {
    if (customStyles) {
      localStorage.setItem(storageKey + "-custom-styles", JSON.stringify(customStyles));
    } else {
      localStorage.removeItem(storageKey + "-custom-styles");
    }
    // Increment theme version when custom styles change
    setThemeVersion(prev => {
      const newVersion = prev + 1;
      localStorage.setItem(storageKey + "-version", newVersion.toString());
      return newVersion;
    });
  }, [customStyles, storageKey]);

  // Apply custom styles to the root element
  useEffect(() => {
    if (customStyles) {
      Object.entries(customStyles).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });
    }
    return () => {
      // Reset custom styles when component unmounts
      if (customStyles) {
        Object.keys(customStyles).forEach((key) => {
          document.documentElement.style.removeProperty(`--${key}`);
        });
      }
    };
  }, [customStyles]);

  // Set the theme class on the HTML element
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system" || theme === "dynamic") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Set up a listener for system theme changes when in system or dynamic mode
  useEffect(() => {
    if (theme !== "system" && theme !== "dynamic") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Get the resolved theme (actual theme being shown)
  const resolvedTheme = React.useMemo(() => {
    if (theme === "system" || theme === "dynamic") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      return systemTheme;
    }
    return theme;
  }, [theme]);

  const setCustomStyles = (styles: Record<string, string> | null) => {
    setCustomStylesState(styles);
  };

  const value = {
    theme,
    resolvedTheme,
    setTheme,
    themeVersion,
    customStyles,
    setCustomStyles,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

function isValidTheme(theme: string): boolean {
  return ["dark", "light", "system", "dynamic"].includes(theme);
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
