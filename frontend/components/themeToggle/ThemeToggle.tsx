"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="flex items-center">
      <label
        htmlFor="theme-toggle"
        className="relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full bg-slate-300 p-1 transition-colors duration-300 dark:bg-emerald-600"
      >
        <div
          className={`flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
          ) : (
            <Sun className="h-4 w-4 text-amber-500" strokeWidth={2.5} />
          )}
        </div>
      </label>
      <input
        id="theme-toggle"
        type="checkbox"
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
        className="sr-only"
      />
    </div>
  );
}