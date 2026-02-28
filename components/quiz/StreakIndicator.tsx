"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakIndicatorProps {
    streak: number;
    isOnFire: boolean;
}

export function StreakIndicator({ streak, isOnFire }: StreakIndicatorProps) {
    if (streak === 0) return null;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${isOnFire
                    ? 'bg-[#ffcc00]/20 border-[#ffcc00] shadow-[0_0_20px_rgba(255,204,0,0.4)]'
                    : 'bg-[#ffcc00]/10 border-[#ffcc00]/30'
                }`}
            role="status"
            aria-label={`Current streak: ${streak}`}
        >
            <motion.div
                animate={isOnFire ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0],
                } : {}}
                transition={{
                    duration: 0.5,
                    repeat: isOnFire ? Infinity : 0,
                    repeatDelay: 1,
                }}
            >
                <Flame
                    className={`w-5 h-5 ${isOnFire ? 'text-[#ffcc00] fill-[#ffcc00]' : 'text-[#ffcc00]'}`}
                    aria-hidden="true"
                />
            </motion.div>
            <span className={`font-bold ${isOnFire ? 'text-[#ffcc00] drop-shadow-[0_0_10px_rgba(255,204,0,0.5)]' : 'text-[#ffcc00]'}`}>
                {streak}
            </span>
        </motion.div>
    );
}
