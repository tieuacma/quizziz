"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FloatingScoreProps {
    points: number;
    isVisible: boolean;
}

export function FloatingScore({ points, isVisible }: FloatingScoreProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.5 }}
                    animate={{ opacity: 1, y: -40, scale: 1 }}
                    exit={{ opacity: 0, y: -60, scale: 0.8 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50"
                    aria-hidden="true"
                >
                    <div className="text-3xl sm:text-4xl font-black text-[#00ff88] drop-shadow-[0_0_20px_rgba(0,255,136,0.8)]">
                        +{points}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
