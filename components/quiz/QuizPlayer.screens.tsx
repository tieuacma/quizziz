"use client";

import { motion } from "framer-motion";
import { Play, Flame, Trophy, Loader2, Sparkles, Target, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizResults } from "./QuizResults";
import { QuizDetail } from "@/lib/types/quiz";

interface QuizPlayerScreensProps {
    status: "loading" | "ready" | "playing" | "finished";
    quiz: QuizDetail;
    totalQuestions: number;
    onStart: () => void;
    onRestart: () => void;
    score: number;
    correctAnswers: number;
    maxStreak: number;
    accuracy: number;
}

// Loading Screen with Skeleton - Dark Purple Theme
export function LoadingScreen() {
    return (
        <div className="min-h-screen bg-[#1a0a2e] flex items-center justify-center p-4">
            <Card className="max-w-lg w-full bg-[#2d1b4e]/90 border-[#00d4ff]/30 shadow-[0_0_50px_rgba(0,212,255,0.2)]">
                <CardContent className="p-8">
                    {/* Skeleton Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 bg-[#3d2b5e] rounded-full animate-pulse mb-6 shadow-[0_0_20px_rgba(0,212,255,0.3)]" />
                        <div className="h-8 w-48 bg-[#3d2b5e] rounded animate-pulse mb-2" />
                        <div className="h-4 w-32 bg-[#3d2b5e] rounded animate-pulse" />
                    </div>

                    {/* Skeleton Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#3d2b5e]/50 rounded-lg p-4 border border-[#00d4ff]/20">
                                <div className="h-8 w-12 bg-[#4d3b6e] rounded animate-pulse mx-auto mb-2" />
                                <div className="h-3 w-16 bg-[#4d3b6e] rounded animate-pulse mx-auto" />
                            </div>
                        ))}
                    </div>

                    {/* Skeleton Button */}
                    <div className="h-14 bg-[#3d2b5e] rounded-xl animate-pulse" />

                    {/* Loading text */}
                    <div className="flex items-center justify-center gap-2 mt-6 text-[#00d4ff]">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-medium">Đang tải câu hỏi...</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


// Ready Screen (Start Screen) - Dark Purple Theme with Neon Accents
export function ReadyScreen({ quiz, totalQuestions, onStart }: {
    quiz: QuizDetail;
    totalQuestions: number;
    onStart: () => void;
}) {
    return (
        <div className="min-h-screen bg-[#1a0a2e] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-lg"
            >
                <Card className="bg-[#2d1b4e]/90 border-[#00d4ff]/30 shadow-[0_0_50px_rgba(0,212,255,0.2)] overflow-hidden">
                    {/* Gradient Header with Neon */}
                    <div className="bg-gradient-to-r from-[#00d4ff]/20 to-[#ff00ff]/20 p-6 text-white border-b border-[#00d4ff]/30">
                        <motion.div
                            className="w-16 h-16 bg-[#00d4ff]/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-2 border-[#00d4ff]/50 shadow-[0_0_30px_rgba(0,212,255,0.4)]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Play className="w-8 h-8 text-[#00d4ff] ml-1" />
                        </motion.div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1 text-white drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]">{quiz.title}</h1>
                        <p className="text-[#00d4ff]/80 text-center text-sm sm:text-base">{quiz.subject}</p>
                    </div>

                    <CardContent className="p-6 sm:p-8">
                        {/* Stats Grid - Dark Purple Theme */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <motion.div
                                className="bg-[#3d2b5e]/80 rounded-xl p-3 sm:p-4 border border-[#00d4ff]/20"
                                whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0,212,255,0.2)" }}
                                transition={{ duration: 0.2 }}
                            >
                                <Target className="w-5 h-5 text-[#00d4ff] mx-auto mb-2" />
                                <div className="text-xl sm:text-2xl font-bold text-[#00d4ff]">
                                    {quiz.questions.length}
                                </div>
                                <div className="text-xs text-[#e0e0ff]/70">Câu hỏi</div>
                            </motion.div>
                            <motion.div
                                className="bg-[#3d2b5e]/80 rounded-xl p-3 sm:p-4 border border-[#ff00ff]/20"
                                whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(255,0,255,0.2)" }}
                                transition={{ duration: 0.2 }}
                            >
                                <Sparkles className="w-5 h-5 text-[#ff00ff] mx-auto mb-2" />
                                <div className="text-xl sm:text-2xl font-bold text-[#ff00ff]">
                                    {totalQuestions}
                                </div>
                                <div className="text-xs text-[#e0e0ff]/70">Tổng cộng</div>
                            </motion.div>
                            <motion.div
                                className="bg-[#3d2b5e]/80 rounded-xl p-3 sm:p-4 border border-[#ffcc00]/20"
                                whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(255,204,0,0.2)" }}
                                transition={{ duration: 0.2 }}
                            >
                                <Clock className="w-5 h-5 text-[#ffcc00] mx-auto mb-2" />
                                <div className="text-xl sm:text-2xl font-bold text-[#ffcc00]">30s</div>
                                <div className="text-xs text-[#e0e0ff]/70">Mỗi câu</div>
                            </motion.div>
                        </div>

                        {/* Bonus Info - Dark Theme */}
                        <div className="bg-gradient-to-r from-[#ffcc00]/10 via-[#ffcc00]/5 to-[#ffcc00]/10 border border-[#ffcc00]/30 rounded-xl p-4 mb-6 sm:mb-8">
                            <div className="flex items-center justify-center gap-2 text-[#ffcc00]">
                                <Flame className="w-5 h-5" />
                                <span className="font-semibold text-sm sm:text-base">Trả lời nhanh để được cộng điểm thưởng!</span>
                            </div>
                        </div>

                        {/* CTA Button - Neon Style */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                onClick={onStart}
                                className="w-full bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] hover:opacity-90 text-white text-lg font-bold py-6 sm:py-7 rounded-xl shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all border border-white/20"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Bắt đầu làm bài
                            </Button>
                        </motion.div>

                        {/* Tips */}
                        <p className="text-center text-[#e0e0ff]/50 text-xs sm:text-sm mt-4">
                            💡 Mẹo: Trả lời càng nhanh, điểm càng cao!
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}


// Finished Screen
export function FinishedScreen({
    score,
    correctAnswers,
    totalQuestions,
    maxStreak,
    accuracy,
    onRestart
}: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    maxStreak: number;
    accuracy: number;
    onRestart: () => void;
}) {
    return (
        <QuizResults
            score={score}
            correctAnswers={correctAnswers}
            totalQuestions={totalQuestions}
            maxStreak={maxStreak}
            accuracy={accuracy}
            onRestart={onRestart}
            onExit={() => window.location.href = "/dashboard"}
        />
    );
}

// QuizPlayerScreens component that handles all non-playing states
export function QuizPlayerScreens(props: QuizPlayerScreensProps) {
    const { status } = props;

    switch (status) {
        case "loading":
            return <LoadingScreen />;
        case "ready":
            return <ReadyScreen
                quiz={props.quiz}
                totalQuestions={props.totalQuestions}
                onStart={props.onStart}
            />;
        case "finished":
            return <FinishedScreen
                score={props.score}
                correctAnswers={props.correctAnswers}
                totalQuestions={props.totalQuestions}
                maxStreak={props.maxStreak}
                accuracy={props.accuracy}
                onRestart={props.onRestart}
            />;
        default:
            return null;
    }
}
