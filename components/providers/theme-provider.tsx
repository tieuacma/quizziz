"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { create } from "zustand";
import type { Theme } from "@/stores/theme-store";

type ThemeStore = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const THEME_KEY = "zenith-theme";

const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "dark";
    try {
        const stored = localStorage.getItem(THEME_KEY) as Theme | null;
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

const useStore = create<ThemeStore>((set) => ({
    theme: "dark", // Static default to prevent hydration mismatch during SSR
    setTheme: (theme: Theme) => {
        set({ theme });
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch {
            // ignore storage errors
        }
    },
}));

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        return {
            theme: useStore.getState().theme,
            setTheme: useStore.getState().setTheme,
        };
    }
    return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useStore((state) => state.theme);
    const setTheme = useStore((state) => state.setTheme);

    // Sync theme from localStorage on client mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(THEME_KEY) as Theme | null;
            if (
                stored === "light" ||
                stored === "dark" ||
                stored === "galaxy"
            ) {
                setTheme(stored);
            } else if (
                window.matchMedia?.("(prefers-color-scheme: light)").matches
            ) {
                setTheme("light");
            }
        } catch {
            // ignore storage errors
        }
    }, [setTheme]);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("theme-light", "theme-dark", "theme-galaxy");
        root.classList.add(`theme-${theme}`);
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}
