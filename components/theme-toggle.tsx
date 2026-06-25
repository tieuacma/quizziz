"use client";

import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

const THEME_OPTIONS: { value: "light" | "dark" | "galaxy"; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Sáng", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Tối", icon: <Moon className="h-4 w-4" /> },
  { value: "galaxy", label: "Galaxy", icon: <Sparkles className="h-4 w-4" /> },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getThemeClasses = () => {
    if (theme === "light") return "border-slate-200 bg-white/70 text-slate-900";
    if (theme === "galaxy") return "border-purple-400/30 bg-purple-900/20 text-white";
    return "border-white/10 bg-white/5 text-white";
  };

  const getActiveClasses = () => {
    if (theme === "light") return "bg-slate-900 text-white shadow-md";
    return "bg-white/15 text-white shadow-lg shadow-purple-500/20";
  };

  const getInactiveClasses = () => {
    if (theme === "light") return "text-slate-600 hover:text-slate-900";
    return "text-white/60 hover:text-white/90";
  };

  return (
    <div
      className={`flex items-center rounded-full border p-1 backdrop-blur-md transition-colors duration-300 ${getThemeClasses()}`}
    >
      {THEME_OPTIONS.map((option) => {
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
              active ? getActiveClasses() : getInactiveClasses()
            }`}
            aria-label={`Chuyển sang chế độ ${option.label}`}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}