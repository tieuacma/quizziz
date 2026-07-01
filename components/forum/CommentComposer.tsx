"use client";

import React, { useState, useTransition } from "react";
import { Send, RefreshCw, CheckCircle2 } from "lucide-react";
import MathRenderer from "./MathRenderer";

export default function CommentComposer({
    postId,
    parentCommentId,
    onSubmitted,
}: {
    postId: string;
    parentCommentId?: string | null;
    onSubmitted?: () => void;
}) {
    const [anonymous, setAnonymous] = useState(false);
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    async function submit() {
        setError(null);
        setSuccessMsg(null);

        if (!content.trim()) {
            setError("Vui lòng nhập nội dung bình luận.");
            return;
        }

        startTransition(async () => {
            const res = await fetch(`/api/forum/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    parentCommentId: parentCommentId ?? null,
                    content: content.trim(),
                    anonymous,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                setError(data?.error || "Gửi bình luận thất bại");
                return;
            }

            setContent("");
            setSuccessMsg(data.message || "Bình luận thành công!");

            // Clear success after 3s
            setTimeout(() => setSuccessMsg(null), 3000);

            onSubmitted?.();
        });
    }

    const hasMath = content.includes("$");

    return (
        <div className="border border-white/8 bg-white/[0.02] rounded-2xl p-4 mt-3">
            <div className="flex items-center justify-between border-b border-white/6 pb-2 mb-3">
                <span className="text-white text-xs font-bold">
                    {parentCommentId ? "Viết phản hồi" : "Thêm thảo luận mới"}
                </span>
            </div>

            <div className="space-y-3">
                <label className="block">
                    <textarea
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/40 transition min-h-[80px]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={
                            parentCommentId
                                ? "Nhập câu trả lời chi tiết của bạn (dùng $...$ cho công thức)..."
                                : "Nhập câu bình luận/thảo luận của bạn..."
                        }
                    />
                </label>

                {/* Live LaTeX preview */}
                {hasMath && content.trim().length > 0 && (
                    <div className="bg-white/[0.01] border border-white/5 rounded-xl p-2.5">
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                            Xem trước công thức:
                        </div>
                        <div className="text-xs text-slate-200 bg-black/20 p-2 rounded border border-white/5">
                            <MathRenderer text={content} />
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <label className="flex items-center gap-2 text-slate-300 text-xs cursor-pointer select-none py-1 hover:text-white transition">
                        <input
                            type="checkbox"
                            checked={anonymous}
                            onChange={(e) => setAnonymous(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-white/10 bg-black/30 text-indigo-600 focus:ring-indigo-500/30 accent-indigo-500"
                        />
                        <span>Bình luận ẩn danh</span>
                    </label>

                    <button
                        disabled={isPending}
                        onClick={submit}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-50"
                    >
                        {isPending ? (
                            <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <Send className="w-3 h-3" />
                                Gửi bình luận
                            </>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-2.5 text-xs">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl p-2.5 text-xs flex items-center gap-1.5 animate-pulse">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        {successMsg}
                    </div>
                )}
            </div>
        </div>
    );
}
