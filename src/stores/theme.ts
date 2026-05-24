import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

function applyTheme(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggle: () => {
        const next: Theme = get().theme === "light" ? "dark" : "light";
        applyTheme(next);
        set({ theme: next });
      },
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    { name: "mastery-theme" }
  )
);
