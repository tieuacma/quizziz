"use client";

import { Trophy, Target, Flame, CheckCircle, XCircle, RotateCcw, Home, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface QuizResultsProps {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    maxStreak: number;
    accuracy: number;
    onRestart: () => void;
    onExit: () => void;
}

export function QuizResults({
    score,
    correctAnswers,
    totalQuestions,
    maxStreak,
    accuracy,
    onRestart,
    onExit,
}: QuizResultsProps) {
    const wrongAnswers = totalQuestions - correctAnswers;
    const [displayScore, setDisplayScore] = useState(0);

    // Determine result message based on accuracy
    const getResultMessage = () => {
        if (accuracy >= 90) return { title: "Xuất sắc!", emoji: "🏆", color: "text-[#00ff88]" };
        if (accuracy >= 70) return { title: "Làm tốt lắm!", emoji: "🌟", color: "text-[#00d4ff]" };
        if (accuracy >= 50) return { title: "Cố gắng thêm nhé!", emoji: "💪", color: "text-[#ffcc00]" };
        return { title: "Đừng nản, lần sau cố gắng!", emoji: "💪", color: "text-[#ff00ff]" };
    };

    const result = getResultMessage();

    // Animated score counter
    useEffect(() => {
        const duration = 1500;
        const startTime = performance.now();
        const startScore = 0;

        const animateScore = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing function (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentScore = Math.round(startScore + (score - startScore) * eased);
            setDisplayScore(currentScore);

            if (progress < 1) {
                requestAnimationFrame(animateScore);
            }
        };

        requestAnimationFrame(animateScore);

        // Trigger confetti if score > 80%
        if (accuracy > 80) {
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#00d4ff', '#ff00ff', '#00ff88', '#ffcc00', '#ff3366'],
                    disableForReducedMotion: true,
                });
            }, 500);
        }
    }, [score, accuracy]);

    return (
        <div className="min-h-screen bg-[#1a0a2e] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <Card className="bg-[#2d1b4e]/90 border-[#00d4ff]/30 shadow-[0_0_50px_rgba(0,212,255,0.2)]">
                    <CardContent className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="text-6xl mb-4"
                            >
                                {result.emoji}
                            </motion.div>
                            <h1 className={`text-3xl font-bold ${result.color} mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
                                {result.title}
                            </h1>
                            <p className="text-[#e0e0ff]/70">Bạn đã hoàn thành bài quiz!</p>
                        </div>

                        {/* Score - Animated with neon glow */}
                        <motion.div
                            className="bg-gradient-to-r from-[#00d4ff]/20 to-[#ff00ff]/20 rounded-2xl p-6 sm:p-8 text-center mb-6 border border-[#00d4ff]/30 shadow-[0_0_30px_rgba(0,212,255,0.2)]"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="text-sm font-medium text-[#00d4ff] mb-1 uppercase tracking-wider">Tổng điểm</div>
                            <div className="text-5xl sm:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                                {displayScore.toLocaleString()}
                            </div>
                        </motion.div>

                        {/* Stats Grid - Dark Purple Theme */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <motion.div
                                className="bg-[#00ff88]/10 rounded-xl p-4 text-center border border-[#00ff88]/30"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <CheckCircle className="w-8 h-8 text-[#00ff88] mx-auto mb-2" />
                                <div className="text-2xl font-bold text-[#00ff88]">{correctAnswers}</div>
                                <div className="text-sm text-[#e0e0ff]/70">Đúng</div>
                            </motion.div>
                            <motion.div
                                className="bg-[#ff3366]/10 rounded-xl p-4 text-center border border-[#ff3366]/30"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <XCircle className="w-8 h-8 text-[#ff3366] mx-auto mb-2" />
                                <div className="text-2xl font-bold text-[#ff3366]">{wrongAnswers}</div>
                                <div className="text-sm text-[#e0e0ff]/70">Sai</div>
                            </motion.div>
                            <motion.div
                                className="bg-[#00d4ff]/10 rounded-xl p-4 text-center border border-[#00d4ff]/30"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Target className="w-8 h-8 text-[#00d4ff] mx-auto mb-2" />
                                <div className="text-2xl font-bold text-[#00d4ff]">{accuracy}%</div>
                                <div className="text-sm text-[#e0e0ff]/70">Độ chính xác</div>
                            </motion.div>
                            <motion.div
                                className="bg-[#ffcc00]/10 rounded-xl p-4 text-center border border-[#ffcc00]/30"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Flame className="w-8 h-8 text-[#ffcc00] mx-auto mb-2" />
                                <div className="text-2xl font-bold text-[#ffcc00]">{maxStreak}</div>
                                <div className="text-sm text-[#e0e0ff]/70">Streak cao nhất</div>
                            </motion.div>
                        </div>

                        {/* Streak Achievements */}
                        {maxStreak >= 3 && (
                            <motion.div
                                className="bg-gradient-to-r from-[#ffcc00]/20 to-[#ff3366]/20 rounded-xl p-4 mb-6 flex items-center gap-3 border border-[#ffcc00]/30"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Star className="w-8 h-8 text-[#ffcc00] fill-[#ffcc00]" />
                                <div>
                                    <div className="font-bold text-[#ffcc00]">Streak Fire!</div>
                                    <div className="text-sm text-[#e0e0ff]/70">Bạn đã có chuỗi {maxStreak} câu đúng liên tiếp!</div>
                                </div>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={onRestart}
                                    className="w-full bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] hover:opacity-90 py-6 text-white font-bold shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                                >
                                    <RotateCcw className="w-5 h-5 mr-2" />
                                    Chơi lại
                                </Button>
                            </motion.div>
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={onExit}
                                    variant="outline"
                                    className="w-full py-6 border-[#ff00ff]/50 text-[#ff00ff] hover:bg-[#ff00ff]/10 font-bold"
                                >
                                    <Home className="w-5 h-5 mr-2" />
                                    Về Dashboard
                                </Button>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
