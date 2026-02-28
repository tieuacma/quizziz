"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    current: number;
    total: number;
    progress: number;
}

export function ProgressBar({ current, total, progress }: ProgressBarProps) {
    return (
        <div
            className="w-full"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progress: ${current} of ${total} questions`}
        >
            <div className="w-full h-3 sm:h-4 bg-[#3d2b5e] rounded-full overflow-hidden border border-[#00d4ff]/20">
                <motion.div
                    className="h-full bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
            </div>
        </div>
    );
}
