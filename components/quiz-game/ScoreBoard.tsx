"use client";

import React, { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ScoreBoardProps {
  score: number;
}

export default function ScoreBoard({ score }: ScoreBoardProps) {
  // Count-up animation with scale-up pulse
  const springValue = useSpring(score, {
    stiffness: 100,
    damping: 20,
  });

  useEffect(() => {
    springValue.set(score);
  }, [score, springValue]);

  const formattedScore = useTransform(springValue, (latest) =>
    Math.round(latest),
  );

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ scale: 1 }}
      animate={{
        scale: 1.05,
        boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
      }}
      transition={{
        scale: { duration: 0.3, repeat: 1, repeatType: "reverse" },
        boxShadow: { duration: 0.5 },
      }}
    >
      <Badge
        variant="secondary"
        className="text-lg font-bold px-4 py-2 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 ring-1 ring-white/20 transition-all"
      >
        <motion.span
          className="text-2xl font-black"
          whileHover={{ scale: 1.05 }}
        >
          {formattedScore}
        </motion.span>
        <span className="text-sm font-medium">pts</span>
      </Badge>
    </motion.div>
  );
}
