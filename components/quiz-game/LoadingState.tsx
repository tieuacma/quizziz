"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

// Animated dots component
function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-violet-400"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Progress bar with shimmer
function ShimmerProgressBar({
  width,
  delay,
}: {
  width: string;
  delay: number;
}) {
  return (
    <div className="h-2 rounded-full bg-white/10 overflow-hidden relative">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay,
          ease: "linear",
        }}
      />
      <div className="absolute inset-0 shimmer" style={{ width }} />
    </div>
  );
}

// Floating particles background
function LoadingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-violet-400/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function LoadingState() {
  return (
    <div className="zenith-immersive min-h-dvh w-full flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 zenith-grid opacity-40 pointer-events-none" />
      <LoadingParticles />

      <motion.div
        className="relative z-10 w-full max-w-md zenith-card rounded-[32px] p-8 text-center overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-[32px] opacity-50">
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 animate-gradient-x" />
        </div>

        <div className="relative">
          {/* Logo/Icon with rotation animation */}
          <motion.div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-600/20 border border-violet-500/30 shadow-[0_0_24px_rgba(139,92,246,0.25)]"
            animate={{
              rotate: 360,
              boxShadow: [
                "0 0 24px rgba(139,92,246,0.25)",
                "0 0 40px rgba(139,92,246,0.5)",
                "0 0 24px rgba(139,92,246,0.25)",
              ],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Loader2 className="h-10 w-10 text-violet-300" />
          </motion.div>

          {/* Title with sparkle */}
          <div className="relative inline-block mb-2">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-2 -right-6 text-yellow-400"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Đang tải quiz
            </h2>
          </div>

          <LoadingDots />

          <p className="text-sm text-slate-400 mb-6 mt-4">
            Chuẩn bị câu hỏi và xáo trộn nội dung
          </p>

          {/* Progress bars with shimmer */}
          <div className="space-y-3">
            <ShimmerProgressBar width="75%" delay={0} />
            <ShimmerProgressBar width="50%" delay={0.3} />
            <ShimmerProgressBar width="90%" delay={0.6} />
          </div>

          {/* Loading percentage */}
          <motion.p
            className="text-xs text-violet-300 mt-4 font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Đang xử lý...
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
