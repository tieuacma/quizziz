"use client";

import { Clock, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toClock } from "./exam-utils";

type Props = {
    title: string;
    currentIndex: number;
    totalQuestions: number;
    answeredCount: number;
    remainingSeconds: number;
    examTimeLimit: number;
};

export default function ExamHeader({
    title,
    currentIndex,
    totalQuestions,
    answeredCount,
    remainingSeconds,
    examTimeLimit,
}: Props) {
    const progress =
        totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
    const timeProgress =
        examTimeLimit > 0 ? (remainingSeconds / examTimeLimit) * 100 : 100;
    const isCritical = remainingSeconds <= 60;
    const isWarning = remainingSeconds <= 300 && !isCritical;

    return (
        <header className="zenith-glass w-full shrink-0 border-b border-white/10 px-4 py-3 md:px-6 flex flex-col gap-3 z-50 pt-[max(0.5rem,env(safe-area-inset-top))]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black text-violet-300/70 uppercase tracking-[0.15em] mb-0.5">
                        Phòng thi
                    </p>
                    <h1 className="font-display text-sm md:text-base font-bold text-white truncate">
                        {title}
                    </h1>
                </div>
                <div
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0 transition-all",
                        isCritical
                            ? "bg-red-500/20 border-red-500/40 animate-pulse"
                            : isWarning
                              ? "bg-amber-500/15 border-amber-500/35"
                              : "bg-black/30 border-white/10"
                    )}
                >
                    {isCritical || isWarning ? (
                        <Clock
                            className={cn(
                                "w-4 h-4",
                                isCritical ? "text-red-400" : "text-amber-400"
                            )}
                        />
                    ) : (
                        <Timer className="w-4 h-4 text-violet-300" />
                    )}
                    <span
                        className={cn(
                            "font-mono font-black text-sm tabular-nums",
                            isCritical
                                ? "text-red-200"
                                : isWarning
                                  ? "text-amber-200"
                                  : "text-white"
                        )}
                    >
                        {toClock(remainingSeconds)}
                    </span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        <span>
                            Câu {currentIndex + 1}/{totalQuestions}
                        </span>
                        <span className="text-emerald-400/90">
                            {answeredCount} đã trả lời
                        </span>
                    </div>
                    <Progress
                        value={progress}
                        className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-violet-400 [&>div]:via-purple-400 [&>div]:to-fuchsia-400"
                    />
                </div>
                <div className="hidden sm:block w-28 shrink-0">
                    <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                        <span>Thời gian</span>
                        <span>{Math.round(timeProgress)}%</span>
                    </div>
                    <Progress
                        value={timeProgress}
                        className={cn(
                            "h-1.5 bg-white/10 [&>div]:transition-all",
                            isCritical
                                ? "[&>div]:bg-red-400"
                                : isWarning
                                  ? "[&>div]:bg-amber-400"
                                  : "[&>div]:bg-violet-400"
                        )}
                    />
                </div>
            </div>
        </header>
    );
}
