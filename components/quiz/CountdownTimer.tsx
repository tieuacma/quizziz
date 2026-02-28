"use client";

import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
    timeRemaining: number;
    totalTime: number;
}

export function CountdownTimer({ timeRemaining, totalTime }: CountdownTimerProps) {
    const percentage = (timeRemaining / totalTime) * 100;

    // Color based on time remaining
    const getColor = () => {
        if (percentage > 60) return "bg-[#00ff88]";
        if (percentage > 30) return "bg-[#ffcc00]";
        return "bg-[#ff3366] animate-pulse";
    };

    const getTextColor = () => {
        if (percentage > 60) return "text-[#00ff88]";
        if (percentage > 30) return "text-[#ffcc00]";
        return "text-[#ff3366]";
    };

    const getBorderColor = () => {
        if (percentage > 60) return "border-[#00ff88]/50";
        if (percentage > 30) return "border-[#ffcc00]/50";
        return "border-[#ff3366]/50";
    };

    return (
        <div
            className="flex items-center gap-2 bg-[#2d1b4e]/80 px-3 py-2 rounded-full border border-[#00d4ff]/30 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            role="timer"
            aria-label={`Time remaining: ${timeRemaining} seconds`}
        >
            <Clock className={`w-5 h-5 ${getTextColor()}`} aria-hidden="true" />
            <div className={`relative w-20 sm:w-24 h-5 sm:h-6 bg-[#3d2b5e] rounded-full overflow-hidden border ${getBorderColor()}`}>
                <motion.div
                    className={`absolute left-0 top-0 h-full ${getColor()}`}
                    initial={{ width: "100%" }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-bold text-sm ${getTextColor()} drop-shadow-md`}>
                        {timeRemaining}s
                    </span>
                </div>
            </div>
        </div>
    );
}
