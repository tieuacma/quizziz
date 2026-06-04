"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface StreakAndRankProps {
  streak: number;
}

// Fire particle component for enhanced flame effect
function FireParticle({
  delay,
  size,
  intensity,
}: {
  delay: number;
  size: number;
  intensity: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(255,200,50,${intensity}) 0%, rgba(255,100,0,${intensity * 0.5}) 50%, transparent 100%)`,
        filter: "blur(1px)",
      }}
      initial={{ y: 0, opacity: intensity, scale: 0.5 }}
      animate={{
        y: [-size * 2, -size * 4 - 10],
        opacity: [intensity, 0],
        scale: [0.5, 1.5, 0],
        x: [0, (Math.random() - 0.5) * 10],
      }}
      transition={{
        duration: 1 + Math.random() * 0.5,
        repeat: Infinity,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

export default function StreakAndRank({ streak }: StreakAndRankProps) {
  const flames = Array.from({ length: Math.min(streak, 5) }, (_, i) => i + 1);

  // Generate fire particles for each flame
  const fireParticles = useMemo(() => {
    if (streak === 0) return [];
    const particles = [];
    for (let i = 0; i < streak * 3; i++) {
      particles.push({
        id: i,
        delay: (i * 0.15) % 1.5,
        size: 3 + Math.random() * 4,
        intensity: 0.3 + Math.random() * 0.5,
      });
    }
    return particles;
  }, [streak]);

  if (streak === 0) return null;

  // Calculate intensity based on streak
  const intensity = Math.min(streak / 5, 1);
  const glowIntensity = 0.3 + intensity * 0.7;

  return (
    <motion.div
      className="flex items-center gap-3 relative"
      initial={{ scale: 1 }}
      animate={{
        scale: 1.1 + intensity * 0.1,
        x: streak > 0 ? [0, -3, 3, 0] : 0,
      }}
      transition={{
        scale: { duration: 0.4 },
        x: { duration: 0.6, repeat: Infinity, repeatType: "reverse" },
      }}
      whileHover={{ scale: 1.15 + intensity * 0.1, rotate: 2 }}
    >
      {/* Pulsing glow background */}
      <div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background: `radial-gradient(circle, rgba(255,165,0,${glowIntensity * 0.4}) 0%, rgba(255,69,0,${glowIntensity * 0.2}) 50%, transparent 70%)`,
          animation: "glow-pulse 1s ease-in-out infinite",
        }}
      />

      <motion.div
        className="relative flex items-center gap-1 p-3 rounded-full bg-gradient-to-r from-orange-500/30 to-red-500/30 border-2 border-orange-400 shadow-lg overflow-visible"
        whileHover={{ scale: 1.1 }}
        style={{
          boxShadow: `0 0 ${15 + intensity * 15}px rgba(255, 165, 0, ${glowIntensity})`,
        }}
      >
        {/* Fire particles */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-full h-6 overflow-visible">
          {fireParticles.map((particle) => (
            <FireParticle
              key={particle.id}
              delay={particle.delay}
              size={particle.size}
              intensity={particle.intensity * intensity}
            />
          ))}
        </div>

        {flames.map((flameNum) => (
          <motion.div
            key={flameNum}
            className="relative"
            animate={{
              scale: [1, 1.3 + intensity * 0.3, 1],
              rotate: [0, 10 + intensity * 5, -10 - intensity * 5, 0],
              filter: [
                `brightness(1)`,
                `brightness(${1.2 + intensity * 0.3})`,
                `brightness(1)`,
              ],
            }}
            transition={{
              duration: 1.5 + flameNum * 0.2,
              repeat: Infinity,
              delay: flameNum * 0.1,
              ease: "easeInOut",
            }}
          >
            <Flame
              className="w-6 h-6 drop-shadow-lg"
              style={{
                color: flameNum <= 2 ? "#fbbf24" : "#f97316",
                filter: `drop-shadow(0 0 ${6 + intensity * 6}px rgba(255, 165, 0, ${glowIntensity}))`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
      >
        <Badge
          className="font-bold text-lg px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-orange-500/50 ring-2 ring-orange-400/30 transition-all relative overflow-hidden"
          style={{
            boxShadow: `0 0 ${20 + intensity * 20}px rgba(255, 165, 0, ${glowIntensity * 0.5})`,
          }}
        >
          {/* Shimmer effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer-wave_2s_infinite]" />
          <span className="relative z-10">x{streak}</span>
        </Badge>
      </motion.div>
    </motion.div>
  );
}
