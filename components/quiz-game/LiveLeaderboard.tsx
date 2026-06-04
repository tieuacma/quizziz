"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, User } from "lucide-react";
import type { LeaderboardParticipant } from "@/types/quiz";

interface LiveLeaderboardProps {
  leaderboard?: LeaderboardParticipant[];
}

export default function LiveLeaderboard({ leaderboard }: LiveLeaderboardProps) {
  if (!leaderboard) return null;

  return (
    <div className="flex flex-col h-full w-full p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden min-h-[300px]">
      <div className="flex items-center gap-2 mb-4 shrink-0 justify-center">
        <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
        <span className="text-sm font-black uppercase text-white tracking-wider">
          Bảng Xếp Hạng
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 custom-scrollbar min-h-0">
        <AnimatePresence initial={false}>
          {leaderboard.map((participant, index) => {
            const isTop3 = index < 3;
            const rankColors = [
              "bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black",
              "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-950 font-black",
              "bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black",
            ];

            return (
              <motion.div
                key={participant.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 relative ${
                  participant.isPlayer
                    ? "border-violet-400/50 bg-violet-500/15 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                    : "border-white/5 bg-white/5"
                }`}
              >
                {/* Position Badge */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    isTop3
                      ? rankColors[index]
                      : "bg-white/10 text-white/70 font-bold"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Avatar Icon */}
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                  {participant.avatar ? (
                    <span>{participant.avatar}</span>
                  ) : (
                    <User className="w-4 h-4 text-white/50" />
                  )}
                </div>

                {/* Name & Streak */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm truncate block font-bold leading-tight ${
                        participant.isPlayer ? "text-violet-200" : "text-white"
                      }`}
                    >
                      {participant.name}
                    </span>
                    {participant.streak >= 3 && (
                      <div className="flex items-center text-orange-400 shrink-0">
                        <Flame className="w-3.5 h-3.5 fill-orange-400 animate-pulse" />
                        <span className="text-[10px] font-black">
                          {participant.streak}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div
                    className={`font-mono text-sm font-black tracking-wide ${
                      participant.isPlayer ? "text-violet-200" : "text-white/90"
                    }`}
                  >
                    {participant.score.toLocaleString()}
                  </div>
                </div>

                {participant.isPlayer && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-400"></span>
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
