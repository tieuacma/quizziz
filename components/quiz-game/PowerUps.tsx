"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake, Eraser, Shield, Zap } from "lucide-react";
import type { PowerUpState, PowerUpType } from "@/types/quiz";

interface PowerUpsProps {
  powerups?: PowerUpState;
  onActivate: (type: PowerUpType) => void;
  currentQuestionType?: string;
  compact?: boolean;
}

export default function PowerUps({
  powerups,
  onActivate,
  currentQuestionType,
  compact = false,
}: PowerUpsProps) {
  if (!powerups) return null;

  const items = [
    {
      type: "freeze" as PowerUpType,
      name: "Đóng băng",
      desc: "Dừng thời gian 10 giây",
      icon: Snowflake,
      color: "from-cyan-500 to-blue-600",
      glowColor: "rgba(6, 182, 212, 0.4)",
      active: powerups.active.freeze,
    },
    {
      type: "eraser" as PowerUpType,
      name: "Tẩy 50/50",
      desc: "Xóa 2 đáp án trắc nghiệm",
      icon: Eraser,
      color: "from-amber-400 to-orange-500",
      glowColor: "rgba(245, 158, 11, 0.4)",
      active: powerups.active.eraser,
      disabled: currentQuestionType !== "multiple-choice",
    },
    {
      type: "shield" as PowerUpType,
      name: "Khiên chắn",
      desc: "Bảo toàn Streak nếu sai",
      icon: Shield,
      color: "from-emerald-400 to-teal-500",
      glowColor: "rgba(16, 185, 129, 0.4)",
      active: powerups.active.shield,
    },
    {
      type: "double" as PowerUpType,
      name: "Nhân đôi",
      desc: "x2 điểm cho câu này",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      glowColor: "rgba(168, 85, 247, 0.4)",
      active: powerups.active.double,
    },
  ];

  if (compact) {
    return (
      <div className="flex flex-row items-center gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const count = powerups.inventory[item.type] ?? 0;
          const isUsable = count > 0 && !item.active && !item.disabled;

          return (
            <motion.button
              key={item.type}
              type="button"
              onClick={() => isUsable && onActivate(item.type)}
              disabled={!isUsable}
              className={`relative flex items-center justify-center p-2 rounded-xl border transition-all duration-300 cursor-pointer shrink-0 ${
                item.active
                  ? "border-white bg-white/20 shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                  : isUsable
                    ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    : "border-white/5 bg-black/10 text-slate-500 opacity-30 cursor-not-allowed"
              }`}
              whileHover={isUsable ? { scale: 1.05 } : {}}
              whileTap={isUsable ? { scale: 0.95 } : {}}
              title={`${item.name}: ${item.desc} (${count} khả dụng)`}
            >
              <div
                className={`w-6 h-6 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center text-white relative ${
                  item.active ? "animate-pulse" : ""
                }`}
                style={{
                  boxShadow: item.active ? `0 0 8px ${item.glowColor}` : "none",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <AnimatePresence>
                  {count > 0 && !item.active && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-[8px] font-black text-white flex items-center justify-center border border-white"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-[10px] font-extrabold text-white/95 ml-1.5 hidden sm:inline select-none">
                {item.name}
              </span>
              {item.active && (
                <span className="absolute bottom-1 right-1 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
      <div className="text-xs font-black uppercase text-white/60 tracking-wider mb-1 text-center">
        Vật Phẩm Bổ Trợ (Power-Ups)
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const count = powerups.inventory[item.type] ?? 0;
          const isUsable = count > 0 && !item.active && !item.disabled;

          return (
            <motion.button
              key={item.type}
              type="button"
              onClick={() => isUsable && onActivate(item.type)}
              disabled={!isUsable}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${
                item.active
                  ? "border-white bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  : isUsable
                    ? "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10 cursor-pointer"
                    : "border-white/5 bg-black/20 text-slate-500 opacity-40 cursor-not-allowed"
              }`}
              whileHover={isUsable ? { scale: 1.05 } : {}}
              whileTap={isUsable ? { scale: 0.95 } : {}}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-2 relative ${
                  item.active ? "animate-pulse" : ""
                }`}
                style={{
                  boxShadow: item.active ? `0 0 15px ${item.glowColor}` : "none",
                }}
              >
                <Icon className="w-5 h-5" />
                <AnimatePresence>
                  {count > 0 && !item.active && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-[10px] font-black text-white flex items-center justify-center shadow-lg border border-white"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-xs font-extrabold text-white">
                {item.name}
              </span>
              <span className="text-[10px] text-white/50 text-center mt-0.5 leading-tight hidden md:block">
                {item.desc}
              </span>
              
              {item.active && (
                <span className="absolute bottom-1 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
