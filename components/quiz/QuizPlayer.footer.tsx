"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Zap } from "lucide-react";

interface QuizPlayerFooterProps {
    correctAnswers: number;
    wrongAnswers: number;
    streak: number;
    isOnFire: boolean;
}

export function QuizPlayerFooter({
    correctAnswers,
    wrongAnswers,
    streak,
    isOnFire,
}: QuizPlayerFooterProps) {
    return (
        <div
            className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#2d1b4e]/95 backdrop-blur-xl border-t border-[#00d4ff]/20"
            role="contentinfo"
            aria-label="Quiz statistics"
        >
            {/* Stats */}
            <div className="flex items-center gap-4 sm:gap-8">
                <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00ff88]/20 flex items-center justify-center border border-[#00ff88]/30">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#00ff88]" aria-hidden="true" />
                    </div>
                    <div>
                        <div className="text-[10px] sm:text-xs font-bold text-[#e0e0ff]/60 uppercase tracking-wider">Đúng</div>
                        <div className="text-lg sm:text-xl font-black text-[#00ff88]">{correctAnswers}</div>
                    </div>
                </motion.div>

                <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#ff3366]/20 flex items-center justify-center border border-[#ff3366]/30">
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff3366]" aria-hidden="true" />
                    </div>
                    <div>
                        <div className="text-[10px] sm:text-xs font-bold text-[#e0e0ff]/60 uppercase tracking-wider">Sai</div>
                        <div className="text-lg sm:text-xl font-black text-[#ff3366]">{wrongAnswers}</div>
                    </div>
                </motion.div>
            </div>

            {/* Streak Indicator */}
            <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isOnFire ? 'bg-[#ffcc00]/30 border-[#ffcc00] shadow-[0_0_20px_rgba(255,204,0,0.4)]' : 'bg-[#ffcc00]/10 border-[#ffcc00]/30'}`}>
                    <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${isOnFire ? 'text-[#ffcc00] fill-[#ffcc00] animate-pulse' : 'text-[#ffcc00]'}`} aria-hidden="true" />
                </div>
                <div>
                    <div className="text-[10px] sm:text-xs font-bold text-[#e0e0ff]/60 uppercase tracking-wider">Streak</div>
                    <div className={`text-lg sm:text-xl font-black transition-all duration-300 ${isOnFire ? 'text-[#ffcc00] drop-shadow-[0_0_10px_rgba(255,204,0,0.5)]' : 'text-[#ffcc00]'}`}>
                        {streak}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
