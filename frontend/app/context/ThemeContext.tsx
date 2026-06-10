"use client";

import { setThemeCookie } from "@/lib/actions/theme";
import { createContext, useContext, useState, useTransition } from "react";

type Theme = "indigo" | "emerald" | "purple" | "amber" | "sky" | "pink";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [, startTransition] = useTransition();

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    startTransition(() => {
      setThemeCookie(newTheme);
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      <div className={`theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useThemeColor = () => {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return ctx;
};
