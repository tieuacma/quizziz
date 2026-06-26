import { create } from "zustand";

export type Theme = "light" | "dark" | "galaxy";
export const THEME_STORAGE_KEY = "zenith-theme" as const;

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem("zenith-theme") as Theme | null;
    if (stored === "light" || stored === "dark" || stored === "galaxy") {
      return stored;
    }
  } catch {
    // ignore storage errors
  }
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark", // Static default to avoid hydration mismatch
  setTheme: (theme: Theme) => {
    set({ theme });
    try {
      localStorage.setItem("zenith-theme", theme);
    } catch {
      // ignore storage errors
    }
  },
}));
