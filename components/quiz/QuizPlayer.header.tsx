"use client";

import { Trophy, Volume2, VolumeX } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { StreakIndicator } from "./StreakIndicator";
import { motion } from "framer-motion";

interface QuizPlayerHeaderProps {
    quizTitle: string;
    currentIndex: number;
    totalQuestions: number;
    redemptionMode?: boolean;
    progress: number;
    accuracy: number;
    displayScore: number;
    streak: number;
    isOnFire: boolean;
    soundEnabled: boolean;
    onToggleSound: () => void;
}

export function QuizPlayerHeader({
    quizTitle,
    currentIndex,
    totalQuestions,
    progress,
    accuracy,
    displayScore,
    streak,
    isOnFire,
    soundEnabled,
    onToggleSound,
}: QuizPlayerHeaderProps) {
    return (
        <div
            className="min-h-[5rem] sm:h-24 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-0 bg-[#2d1b4e]/95 backdrop-blur-xl border-b border-[#00d4ff]/30 z-20"
            role="banner"
            aria-label="Quiz progress header"
        >

            {/* Left Section - Title & Streak */}
            <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start mb-2 sm:mb-0">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#00d4ff]/70 tracking-widest uppercase hidden sm:block">Quizizz Mode</span>
                    <span className="text-xl sm:text-2xl font-black truncate max-w-[200px] sm:max-w-[250px] leading-none text-white drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]">{quizTitle}</span>
                </div>
                <div className="h-8 sm:h-10 w-px bg-[#00d4ff]/30 mx-1 sm:mx-2 hidden sm:block" />
                <StreakIndicator streak={streak} isOnFire={isOnFire} />
            </div>

            {/* Progress Bar - Center */}
            <div className="flex-1 w-full sm:max-w-2xl sm:mx-6 lg:mx-10 order-last sm:order-none mt-2 sm:mt-0">
                <div className="flex justify-between mb-1 text-[10px] sm:text-xs font-black text-[#00d4ff]/70 uppercase tracking-widest">
                    <span className="text-[#00d4ff]">Câu {currentIndex + 1} / {totalQuestions}</span>
                    <span className="hidden sm:inline text-[#00ff88]">Độ chính xác: {accuracy}%</span>
                </div>
                <ProgressBar
                    current={currentIndex + 1}
                    total={totalQuestions}
                    progress={progress}
                />
                {/* Mobile accuracy */}
                <div className="sm:hidden text-[10px] font-black text-[#00ff88] uppercase tracking-widest mt-1 text-right">
                    Độ chính xác: {accuracy}%
                </div>
            </div>

            {/* Right Section - Score & Sound */}
            <div className="flex items-center gap-3 sm:gap-4">
                <motion.div
                    key={displayScore}
                    initial={false}
                    animate={{
                        scale: [1, 1.08, 1],
                    }}
                    transition={{ duration: 0.25 }}
                    className="bg-[#3d2b5e]/80 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 border border-[#00d4ff]/30 shadow-[0_0_20px_rgba(0,212,255,0.2)]"

                    aria-label={`Current score: ${displayScore} points`}
                >
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffcc00]" aria-hidden="true" />
                    <span className="text-2xl sm:text-3xl font-black tabular-nums text-white drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]">
                        {displayScore.toLocaleString()}
                    </span>
                </motion.div>
                <button
                    onClick={onToggleSound}
                    className="p-2 sm:p-3 hover:bg-[#00d4ff]/20 rounded-full transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] text-[#00d4ff]"
                    aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
                    aria-pressed={soundEnabled}
                >
                    {soundEnabled ? <Volume2 size={22} className="sm:w-6 sm:h-6" /> : <VolumeX size={22} className="sm:w-6 sm:h-6" />}
                </button>
            </div>
        </div>
    );
}
