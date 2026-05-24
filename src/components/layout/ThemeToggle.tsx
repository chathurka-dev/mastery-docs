"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/theme";

export function ThemeToggle() {
  const { theme, toggle, setTheme } = useThemeStore();

  // Sync DOM on mount (in case localStorage value differs from default)
  useEffect(() => {
    const stored = localStorage.getItem("mastery-theme");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.theme) setTheme(parsed.state.theme);
      } catch {}
    }
  }, [setTheme]);

  return (
    <button
      onClick={toggle}
      suppressHydrationWarning
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-500" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
