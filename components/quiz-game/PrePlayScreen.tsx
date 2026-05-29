"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quizGameCopy } from "./copy";

import { AudioSettingsState } from "@/types/quiz";

interface PrePlayScreenProps {
  questionCount: number;
  estimatedSeconds: number;
  isPracticeMode?: boolean;
  onStart: () => void;
  audioSettings?: AudioSettingsState;
  toggleAudioSetting?: (setting: "music" | "sfx") => void;
}

export default function PrePlayScreen({
  questionCount,
  estimatedSeconds,
  isPracticeMode,
  onStart,
  audioSettings,
  toggleAudioSetting,
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
        <p className="text-slate-400 text-sm mb-4">
          {quizGameCopy.prePlay.estimatedTime(estimatedSeconds)}
        </p>
        
        {/* Sound toggle switches */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => toggleAudioSetting?.("music")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              audioSettings?.music
                ? "bg-indigo-500/10 border-indigo-400/50 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                : "bg-slate-900/40 border-slate-800 text-slate-500"
            }`}
          >
            {audioSettings?.music ? "🎵 Nhạc nền: Bật" : "🔇 Nhạc nền: Tắt"}
          </button>
          <button
            type="button"
            onClick={() => toggleAudioSetting?.("sfx")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              audioSettings?.sfx
                ? "bg-indigo-500/10 border-indigo-400/50 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                : "bg-slate-900/40 border-slate-800 text-slate-500"
            }`}
          >
            {audioSettings?.sfx ? "⚡ Âm thanh: Bật" : "🔇 Âm thanh: Tắt"}
          </button>
        </div>

        <p className="text-slate-500 text-xs mb-8">
          Trả lời xong sẽ tự chuyển sang câu tiếp theo
        </p>
        <Button
          size="lg"
          className="w-full h-14 text-lg font-bold gap-2 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer"
          onClick={onStart}
        >
          <Play className="w-5 h-5" />
          {quizGameCopy.prePlay.start}
        </Button>
      </motion.div>
    </div>
  );
}
