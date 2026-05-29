"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, BookOpen, Clock, Zap, Star, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quizGameCopy } from "./copy";
import { cn } from "@/lib/utils";

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
  const minutes = Math.ceil(estimatedSeconds / 60);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden select-none">
      
      {/* Immersive Cosmic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.12),transparent_50%)]" />
      </div>

      {/* Lobby Glassmorphic Card */}
      <motion.div
        className="max-w-md w-full rounded-[32px] border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-8 xl:p-10 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(99,102,241,0.15)] z-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Glowing Lobby Icon */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center relative shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <BookOpen className="w-8 h-8 text-indigo-300" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full animate-ping" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight flex items-center justify-center gap-2">
          {isPracticeMode ? (
            <>
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" />
              Chế Độ Ôn Tập
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-indigo-400" />
              {quizGameCopy.prePlay.title}
            </>
          )}
        </h1>
        
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-6">
          Chuẩn bị sẵn sàng cho bài thi trắc nghiệm tương tác
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
            <Trophy className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tổng câu hỏi</span>
            <span className="text-lg font-black text-white mt-0.5">{questionCount} câu</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
            <Clock className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Thời gian thi</span>
            <span className="text-lg font-black text-white mt-0.5">~{minutes} phút</span>
          </div>
        </div>

        {/* Arcade Rules Card */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 text-left mb-8 space-y-3.5">
          <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Star className="w-3.5 h-3.5 fill-indigo-400/20 text-indigo-400" />
            Thể lệ cuộc đua điểm số
          </h3>
          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="text-indigo-400 font-mono mt-0.5">1.</span>
              <p>Trả lời càng nhanh, điểm thời gian cộng thêm càng lớn.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-400 font-mono mt-0.5">2.</span>
              <p>Chuỗi đúng liên tiếp từ <strong className="text-indigo-400">3 câu trở lên</strong> kích hoạt hệ số nhân điểm <strong className="text-amber-400">1.5x Combo Bonus!</strong></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-400 font-mono mt-0.5">3.</span>
              <p>Khi hoàn thành, bạn có thể tự do xem lại chi tiết các câu trả lời chưa đúng.</p>
            </div>
          </div>
        </div>

        {/* Pulsating Glowing Action Button */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Button
            size="lg"
            className="w-full h-14 text-base font-bold gap-2 cursor-pointer bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.3)] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            onClick={onStart}
          >
            <Play className="w-4 h-4 fill-white" />
            {quizGameCopy.prePlay.start}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
