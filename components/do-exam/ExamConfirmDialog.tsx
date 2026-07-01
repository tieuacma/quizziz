"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import styles from "@/styles/exam.module.css";

type Props = {
    answeredCount: number;
    totalQuestions: number;
    unansweredCount: number;
    flaggedCount: number;
    submitting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function ExamConfirmDialog({
    answeredCount,
    totalQuestions,
    unansweredCount,
    flaggedCount,
    submitting,
    onCancel,
    onConfirm,
}: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`${styles.glassCard} w-full max-w-md p-6`}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="text-lg text-white font-bold">
                        Xác nhận nộp bài
                    </h3>
                </div>

                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                    Bạn đã trả lời{" "}
                    <span className="text-emerald-300 font-semibold">
                        {answeredCount}
                    </span>
                    /{totalQuestions} câu. Sau khi nộp sẽ không thể chỉnh sửa
                    đáp án.
                </p>

                <div className="grid grid-cols-2 gap-2 mb-5 text-sm">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                            Chưa làm
                        </p>
                        <p className="text-white font-bold">
                            {unansweredCount}
                        </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                            Đánh dấu
                        </p>
                        <p className="text-amber-300 font-bold">
                            {flaggedCount}
                        </p>
                    </div>
                </div>

                {unansweredCount > 0 ? (
                    <p className="text-xs text-amber-200/90 mb-4 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2">
                        Còn {unansweredCount} câu chưa trả lời — bạn vẫn có thể
                        nộp, nhưng các câu đó sẽ tính là sai.
                    </p>
                ) : null}

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 border-white/15"
                        onClick={onCancel}
                    >
                        Tiếp tục làm
                    </Button>
                    <Button
                        className="zenith-btn-glow flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 border-0"
                        disabled={submitting}
                        onClick={onConfirm}
                    >
                        {submitting ? "Đang nộp..." : "Nộp ngay"}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
