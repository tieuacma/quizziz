"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, BookOpen, Zap, Sparkles } from "lucide-react";
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
    <div className="zenith-immersive min-h-dvh w-full flex items-center justify-center text-white relative overflow-hidden select-none px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      {/* Background Starfield and Grids */}
      <div className="absolute inset-0 z-0 zenith-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none zenith-nebula-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-3xl pointer-events-none zenith-nebula-pulse" />

      <motion.div
        className="max-w-md w-full zenith-card rounded-[32px] p-8 xl:p-10 text-center z-10 animate-float-slow hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] transition-all duration-500"
        initial={{ opacity: 0, scale: 0.93, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="relative z-10">
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.3)] ring-1 ring-white/10 relative">
            <BookOpen className="w-8 h-8 text-violet-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center justify-center gap-2 text-neon-glow-violet">
            {isPracticeMode ? (
              <>
                <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <span className="zenith-gradient-text">Chế Độ Ôn Tập</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
                <span className="zenith-gradient-text">{quizGameCopy.prePlay.title}</span>
              </>
            )}
          </h1>

          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Chuẩn bị sẵn sàng cho bài thi trắc nghiệm tương tác
          </p>
          <p className="text-slate-500 text-xs mb-6">
            {quizGameCopy.prePlay.questionCount(questionCount)}
          </p>

          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => toggleAudioSetting?.("music")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                audioSettings?.music
                  ? "bg-cyan-500/10 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.25)] neon-border-cyan"
                  : "bg-white/[0.03] border-white/10 text-slate-500 hover:text-slate-400"
              }`}
            >
              {audioSettings?.music ? "🎵 Nhạc nền: Bật" : "🔇 Nhạc nền: Tắt"}
            </button>
            <button
              type="button"
              onClick={() => toggleAudioSetting?.("sfx")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                audioSettings?.sfx
                  ? "bg-violet-500/10 border-violet-400/50 text-violet-300 shadow-[0_0_12px_rgba(167,139,250,0.25)] neon-border-violet"
                  : "bg-white/[0.03] border-white/10 text-slate-500 hover:text-slate-400"
              }`}
            >
              {audioSettings?.sfx ? "⚡ Âm thanh: Bật" : "🔇 Âm thanh: Tắt"}
            </button>
          </div>

          <p className="text-slate-500 text-xs mb-4">
            {quizGameCopy.prePlay.estimatedTime(estimatedSeconds)}
          </p>

          <p className="text-slate-500 text-xs mb-8">
            Trả lời xong sẽ tự chuyển sang câu tiếp theo
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              className="galaxy-portal-button w-full min-h-11 h-14 text-base font-extrabold cursor-pointer rounded-2xl text-white border-0 transition-all duration-300 shadow-[0_0_25px_rgba(167,139,250,0.3)] hover:shadow-[0_0_35px_rgba(167,139,250,0.5)]"
              onClick={onStart}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Play className="w-4 h-4 fill-white text-white" />
                {quizGameCopy.prePlay.start}
              </span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
