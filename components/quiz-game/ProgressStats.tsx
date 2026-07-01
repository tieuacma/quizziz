"use client";

import React from "react";
import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface ProgressStatsProps {
    correctCount: number;
    wrongCount: number;
}

export default function ProgressStats({
    correctCount,
    wrongCount,
}: ProgressStatsProps) {
    const total = correctCount + wrongCount;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return (
        <motion.div
            className="w-full flex items-center justify-between gap-6 max-w-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="flex flex-col items-start gap-1"
                whileHover={{ scale: 1.02 }}
            >
                <Badge className="text-base sm:text-lg font-bold px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-300/40 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-md">
                    <CheckCircle className="w-5 h-5 mr-2 inline-block" />
                    {correctCount}
                    <span className="ml-1 text-emerald-200">
                        Số câu đúng ✅
                    </span>
                </Badge>
            </motion.div>

            <motion.div
                className="flex flex-col items-center gap-2"
                whileHover={{ scale: 1.02 }}
            >
                <Badge className="text-base sm:text-lg font-bold px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 border border-purple-300/40 text-white shadow-[0_0_40px_rgba(147,51,234,0.18)] backdrop-blur-md">
                    <span className="mr-2">🎯</span>
                    {accuracy}%
                    <span className="ml-2 text-white/80">Chính xác</span>
                </Badge>
            </motion.div>

            <motion.div
                className="flex flex-col items-end gap-1"
                whileHover={{ scale: 1.02 }}
            >
                <Badge className="text-base sm:text-lg font-bold px-4 py-3 rounded-2xl bg-gradient-to-r from-red-500/30 to-rose-500/30 border border-red-300/40 text-red-200 shadow-[0_0_30px_rgba(239,68,68,0.15)] backdrop-blur-md">
                    <XCircle className="w-5 h-5 mr-2 inline-block" />
                    {wrongCount}
                    <span className="ml-1 text-red-200">Số câu sai ❌</span>
                </Badge>
            </motion.div>
        </motion.div>
    );
}
