"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="zenith-immersive min-h-screen flex items-center justify-center px-4">
            <div className="absolute inset-0 zenith-grid opacity-40 pointer-events-none" />
            <div className="relative z-10 max-w-md w-full zenith-card p-8 text-center">
                <h1 className="font-display text-6xl font-extrabold zenith-gradient-text mb-2">
                    404
                </h1>
                <h2 className="text-xl font-bold text-white mb-2">
                    Bài Quiz không tồn tại
                </h2>
                <p className="text-slate-400 mb-8 text-sm">
                    Có thể bạn đã nhập sai mã ID hoặc bài quiz đã bị xóa.
                </p>
                <Button
                    asChild
                    size="lg"
                    className="zenith-btn-glow w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 border-0"
                >
                    <Link
                        href="/quiz-game"
                        className="flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại trang Quiz
                    </Link>
                </Button>
            </div>
        </div>
    );
}
