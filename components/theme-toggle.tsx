"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Sparkles, Check } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

const THEME_OPTIONS = [
    {
        value: "light" as const,
        label: "Sáng",
        icon: <Sun className="h-4 w-4" />,
    },
    {
        value: "dark" as const,
        label: "Tối",
        icon: <Moon className="h-4 w-4" />,
    },
    {
        value: "galaxy" as const,
        label: "Galaxy",
        icon: <Sparkles className="h-4 w-4" />,
    },
];

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const t = window.setTimeout(() => setMounted(true), 0);
        return () => window.clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40">
                <Moon className="h-5 w-5 animate-pulse" />
            </div>
        );
    }

    const getTriggerClasses = () => {
        if (theme === "light") {
            return "border-slate-200 bg-white/70 text-black hover:bg-white/90 shadow-sm";
        }
        if (theme === "galaxy") {
            return "border-purple-500/30 bg-purple-950/40 text-white hover:bg-purple-900/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]";
        }
        return "border-white/10 bg-white/5 text-white hover:bg-white/10";
    };

    const getActiveIcon = () => {
        if (theme === "light")
            return <Sun className="h-5 w-5 text-amber-500" />;
        if (theme === "galaxy")
            return <Sparkles className="h-5 w-5 text-purple-400" />;
        return <Moon className="h-5 w-5 text-sky-400" />;
    };

    return (
        <div className="relative">
            <motion.button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 relative cursor-pointer outline-none select-none ${getTriggerClasses()}`}
                aria-label="Thay đổi chủ đề"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={theme}
                        initial={{ scale: 0.6, rotate: -90, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.6, rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center justify-center"
                    >
                        {getActiveIcon()}
                    </motion.span>
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={`absolute right-0 mt-2 w-40 rounded-2xl border p-1.5 backdrop-blur-xl shadow-2xl z-50 flex flex-col gap-0.5 ${
                            theme === "light"
                                ? "border-slate-200 bg-white/90 text-black shadow-slate-200/50"
                                : theme === "galaxy"
                                  ? "border-purple-500/20 bg-purple-950/80 text-white shadow-purple-950/50"
                                  : "border-white/10 bg-zinc-900/90 text-white shadow-black/50"
                        }`}
                    >
                        {THEME_OPTIONS.map((option) => {
                            const active = theme === option.value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        setTheme(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-left outline-none ${
                                        active
                                            ? theme === "light"
                                                ? "bg-slate-100 text-black font-semibold"
                                                : theme === "galaxy"
                                                  ? "bg-purple-500/20 text-purple-200 font-semibold"
                                                  : "bg-white/10 text-white font-semibold"
                                            : theme === "light"
                                              ? "text-black/85 hover:text-black hover:bg-slate-50"
                                              : theme === "galaxy"
                                                ? "text-purple-300/70 hover:bg-purple-900/30 hover:text-white"
                                                : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className={`transition-colors duration-200 ${
                                                active
                                                    ? theme === "light"
                                                        ? "text-amber-500"
                                                        : theme === "galaxy"
                                                          ? "text-purple-400"
                                                          : "text-sky-400"
                                                    : ""
                                            }`}
                                        >
                                            {option.icon}
                                        </span>
                                        <span>{option.label}</span>
                                    </div>
                                    {active && (
                                        <Check className="h-4 w-4 stroke-[3px] text-emerald-500" />
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
