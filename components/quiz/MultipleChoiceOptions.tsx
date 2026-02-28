"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useCallback } from "react";

interface MultipleChoiceOptionsProps {
    options: { id: string; text: string }[];
    selectedAnswerID: string | null;
    correctAnswerID: string | null;
    showFeedback: boolean;
    onSelect: (answer: string) => void;
    disabled?: boolean;
}

// Safe normalize function with null/undefined checking
function normalizeAnswer(a: unknown): string {
    if (typeof a !== "string") return "";
    return a.trim().toLowerCase();
}

export function MultipleChoiceOptions({
    options,
    selectedAnswerID,
    correctAnswerID,
    showFeedback,
    onSelect,
    disabled = false,
}: MultipleChoiceOptionsProps) {
    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent, optionId: string) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled && !showFeedback) {
                onSelect(optionId);
            }
        }
    }, [disabled, showFeedback, onSelect]);

    return (
        <div
            className="flex flex-col gap-4 min-h-[200px] w-full"
            role="radiogroup"
            aria-label="Multiple choice options"
        >
            {options.map((option, idx) => {

                const optionText =
                    typeof option.text === "string"
                        ? option.text
                        : Object.entries(option)
                            .filter(([key]) => key !== "id")
                            .map(([, value]) => value)
                            .join("");

                const isSelected = selectedAnswerID === option.id;
                const isCorrect = correctAnswerID === option.id;

                let containerClass = "";
                let borderClass = "border-2 border-transparent";
                let icon = null;
                let shadowClass = "";

                if (showFeedback) {
                    if (isCorrect) {
                        containerClass = "bg-[#00ff88]/20";
                        borderClass = "border-2 border-[#00ff88]";
                        shadowClass = "shadow-[0_0_30px_rgba(0,255,136,0.4)]";
                        icon = <CheckCircle className="w-8 h-8 text-[#00ff88]" aria-hidden="true" />;
                    } else if (isSelected && !isCorrect) {
                        containerClass = "bg-[#ff3366]/20";
                        borderClass = "border-2 border-[#ff3366]";
                        shadowClass = "shadow-[0_0_30px_rgba(255,51,102,0.4)]";
                        icon = <XCircle className="w-8 h-8 text-[#ff3366]" aria-hidden="true" />;
                    } else {
                        containerClass = "bg-[#1a1a2e]/50 opacity-50";
                    }
                } else {
                    // Not showing feedback yet
                    if (isSelected) {
                        containerClass = "bg-[#00d4ff]/20";
                        borderClass = "border-2 border-[#00d4ff]";
                        shadowClass = "shadow-[0_0_30px_rgba(0,212,255,0.4)]";
                    } else {
                        containerClass = "bg-[#3d2b5e]/80 hover:bg-[#4d3b6e]";
                        borderClass = "border-2 border-[#00d4ff]/30 hover:border-[#00d4ff]/60";
                    }

                }

                return (
                    <motion.button
                        key={option.id}
                        disabled={disabled || showFeedback}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: showFeedback && !isSelected && !isCorrect ? 0.4 : 1,
                            y: 0,
                        }}
                        transition={{
                            delay: idx * 0.05,
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                        }}
                        whileHover={
                            !disabled && !showFeedback && !isSelected
                                ? {
                                    scale: 1.02,
                                    y: -3,
                                    boxShadow: "0 10px 40px rgba(0,212,255,0.2)"
                                }
                                : {}
                        }
                        whileTap={
                            !disabled && !showFeedback
                                ? { scale: 0.96 }
                                : {}
                        }
                        onClick={() => onSelect(option.id)}
                        onKeyDown={(e) => handleKeyDown(e, option.id)}
                        className={`
                            ${containerClass}
                            ${borderClass}
                            ${shadowClass}
                            relative
                            rounded-2xl 
                            py-6 sm:py-7 lg:py-8 px-6 sm:px-8 lg:px-10
                            flex items-center justify-between
                            group 
                            overflow-hidden
                            transition-all duration-200
                            disabled:cursor-not-allowed
                            text-left
                            focus:outline-none focus:ring-4 focus:ring-[#00d4ff]/50
                        `}
                        role="radio"
                        aria-checked={isSelected}
                        aria-disabled={disabled || showFeedback}
                        tabIndex={disabled || showFeedback ? -1 : 0}
                    >
                        {/* Hover glow effect */}
                        {!showFeedback && !isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00d4ff]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        )}

                        <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                            <div className={`
                                w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl lg:text-3xl transition-colors shadow-lg
                                ${isSelected && !showFeedback
                                    ? "bg-[#00d4ff] text-[#0a0a0f]"
                                    : "bg-[#00d4ff]/20 text-[#00d4ff]"
                                }
                                ${showFeedback && isCorrect ? "bg-[#00ff88] text-[#0a0a0f]" : ""}
                                ${showFeedback && isSelected && !isCorrect ? "bg-[#ff3366] text-white" : ""}
                            `}>
                                {idx + 1}
                            </div>

                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                {optionText || "Lỗi: Không có nội dung"}
                            </span>
                        </div>

                        {icon && (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative z-10"
                            >
                                {icon}
                            </motion.div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
