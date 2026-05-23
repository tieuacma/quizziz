"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quizGameCopy } from "./copy";

interface PrePlayScreenProps {
  questionCount: number;
  estimatedSeconds: number;
  isPracticeMode?: boolean;
  onStart: () => void;
}

export default function PrePlayScreen({
  questionCount,
  estimatedSeconds,
  isPracticeMode,
  onStart,
}: PrePlayScreenProps) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-6">
      <motion.div
        className="max-w-lg w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center shadow-2xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-indigo-300" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">
          {isPracticeMode
            ? quizGameCopy.prePlay.practiceMode
            : quizGameCopy.prePlay.title}
        </h1>
        <p className="text-slate-300 mb-1">
          {quizGameCopy.prePlay.questionCount(questionCount)}
        </p>
        <p className="text-slate-400 text-sm mb-2">
          {quizGameCopy.prePlay.estimatedTime(estimatedSeconds)}
        </p>
        <p className="text-slate-500 text-xs mb-8">
          Trả lời xong sẽ tự chuyển sang câu tiếp theo
        </p>
        <Button
          size="lg"
          className="w-full h-14 text-lg font-bold gap-2 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          onClick={onStart}
        >
          <Play className="w-5 h-5" />
          {quizGameCopy.prePlay.start}
        </Button>
      </motion.div>
    </div>
  );
}
