"use client";

import React, { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ScoreBoardProps {
    score: number;
}

export default function ScoreBoard({ score }: ScoreBoardProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const springValue = useSpring(0, {
        stiffness: 120,
        damping: 15,
        mass: 0.5,
    });

    const formattedScore = useTransform(springValue, (latest) =>
        Math.round(latest).toLocaleString()
    );

    // Animate score change with bounce effect
    useEffect(() => {
        // Cancel any ongoing animation
        const controls = animate(springValue, score, {
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1], // Elastic ease out
        });

        // Add glow pulse effect on score change
        if (containerRef.current) {
            containerRef.current.animate(
                [
                    { boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" },
                    {
                        boxShadow:
                            "0 0 40px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4)",
                    },
                    { boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" },
                ],
                { duration: 500, easing: "ease-out" }
            );
        }

        return () => controls.stop();
    }, [score, springValue]);

    return (
        <motion.div
            ref={containerRef}
            className="flex items-center gap-2 relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            {/* Animated glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 blur-xl rounded-full animate-pulse" />

            <Badge
                variant="secondary"
                className="relative text-lg font-bold px-4 py-2 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 ring-1 ring-white/20 transition-all overflow-hidden"
            >
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer-wave_2s_infinite]" />

                <motion.span
                    className="text-2xl font-black relative z-10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    {formattedScore}
                </motion.span>
                <span className="text-sm font-medium ml-1 relative z-10">
                    pts
                </span>
            </Badge>
        </motion.div>
    );
}
