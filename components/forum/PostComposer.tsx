"use client";

import React, { useState, useTransition } from "react";
import {
    Send,
    HelpCircle,
    Paperclip,
    Sigma,
    RefreshCw,
    CheckCircle2,
} from "lucide-react";
import MathRenderer from "./MathRenderer";

export default function PostComposer({
    onCreated,
}: {
    onCreated?: () => void;
}) {
    const [anonymous, setAnonymous] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // Attachments state
    const [attachments, setAttachments] = useState<
        { name: string; url: string; size: number; mimeType: string }[]
    >([]);
    const [showMathHelp, setShowMathHelp] = useState(false);

    // MOCK file upload handling
    function handleAddMockFile() {
        const mockFiles = [
            {
                name: "Đề-cương-ôn-tập-Toán.pdf",
                url: "https://example.com/doc1.pdf",
                size: 1024 * 1024 * 1.5,
                mimeType: "application/pdf",
            },
            {
                name: "Sơ-đồ-tư-duy-Hóa-học.png",
                url: "https://example.com/img2.png",
                size: 1024 * 512,
                mimeType: "image/png",
            },
        ];
        // Pick a file randomly
        const randomFile =
            mockFiles[Math.floor(Math.random() * mockFiles.length)];
        // Prevent duplicates
        if (attachments.some((f) => f.name === randomFile.name)) return;
        setAttachments([...attachments, randomFile]);
    }

    function handleRemoveFile(name: string) {
        setAttachments(attachments.filter((f) => f.name !== name));
    }

    async function submit() {
        setError(null);
        setSuccessMsg(null);

        if (!title.trim()) {
            setError("Vui lòng nhập tiêu đề bài viết.");
            return;
        }
        if (!content.trim()) {
            setError("Vui lòng nhập nội dung bài viết.");
            return;
        }

        startTransition(async () => {
            const res = await fetch("/api/forum/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                    anonymous,
                    attachments,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                setError(data?.error || "Đăng bài thất bại");
                return;
            }

            setTitle("");
            setContent("");
            setAttachments([]);
            setSuccessMsg(data.message || "Đăng bài thành công!");

            // Auto clear success message after 4s
            setTimeout(() => setSuccessMsg(null), 4000);

            onCreated?.();
        });
    }

    const hasMath = content.includes("$");

    return (
        <div className="relative border border-white/8 bg-gradient-to-b from-white/[0.04] to-white/[0.01] rounded-2xl p-5 shadow-xl overflow-hidden group">
            {/* Background glow lines */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition duration-500" />

            <div className="flex items-center justify-between border-b border-white/6 pb-3 mb-4">
                <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-white text-sm font-bold">
                        Đặt câu hỏi thảo luận mới
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={() => setShowMathHelp(!showMathHelp)}
                    className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition"
                >
                    <Sigma className="w-3 h-3" />
                    {showMathHelp ? "Đóng hướng dẫn" : "Hướng dẫn công thức"}
                </button>
            </div>

            {showMathHelp && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5 mb-4 text-xs text-emerald-200/90 leading-relaxed space-y-1">
                    <p className="font-bold mb-1">
                        Cách chèn công thức Toán học (LaTeX):
                    </p>
                    <p>
                        • Dùng <b>$công thức$</b> để viết công thức ngay trong
                        dòng: ví dụ $E=mc^2$ viết là{" "}
                        <code className="bg-black/40 px-1 py-0.5 rounded text-emerald-300">
                            $E=mc^2$
                        </code>
                        .
                    </p>
                    <p>
                        • Dùng <b>$$công thức$$</b> để tạo khối công thức riêng
                        biệt ở dòng mới: ví dụ{" "}
                        <code className="bg-black/40 px-1 py-0.5 rounded text-emerald-300">
                            {"$$\\sum_{1}^{n} i$$"}
                        </code>
                        .
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <label className="block">
                    <div className="text-slate-300 text-xs font-semibold mb-1.5">
                        Tiêu đề thảo luận
                    </div>
                    <input
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/40 transition"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ví dụ: Làm thế nào để giải phương trình lượng giác bậc hai?"
                    />
                </label>

                <label className="block">
                    <div className="text-slate-300 text-xs font-semibold mb-1.5">
                        Nội dung câu hỏi
                    </div>
                    <textarea
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/40 transition min-h-[140px] font-sans"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Mô tả chi tiết câu hỏi của bạn. Bạn có thể sử dụng công thức toán học $...$ hoặc markdown..."
                    />
                </label>

                {/* Live LaTeX preview */}
                {hasMath && content.trim().length > 0 && (
                    <div className="bg-white/[0.02] border border-white/6 rounded-xl p-3.5">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                            Xem trước công thức (Live Preview):
                        </div>
                        <div className="text-sm text-slate-200 bg-black/20 p-2.5 rounded-lg border border-white/5">
                            <MathRenderer text={content} />
                        </div>
                    </div>
                )}

                {/* Attachments Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-xs font-semibold">
                            Tệp đính kèm ({attachments.length})
                        </span>
                        <button
                            type="button"
                            onClick={handleAddMockFile}
                            className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white transition"
                        >
                            <Paperclip className="w-3.5 h-3.5" />
                            Đính kèm tài liệu mẫu
                        </button>
                    </div>

                    {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {attachments.map((file) => (
                                <div
                                    key={file.name}
                                    className="flex items-center gap-2 px-2.5 py-1 bg-white/[0.04] border border-white/8 rounded-lg text-xs text-slate-300"
                                >
                                    <span className="max-w-[150px] truncate">
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveFile(file.name)
                                        }
                                        className="text-red-400 hover:text-red-300 font-bold ml-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Foot actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/6 pt-4 mt-2">
                    <label className="flex items-center gap-2.5 text-slate-300 text-xs cursor-pointer select-none py-1 hover:text-white transition">
                        <input
                            type="checkbox"
                            checked={anonymous}
                            onChange={(e) => setAnonymous(e.target.checked)}
                            className="w-4 h-4 rounded border-white/10 bg-black/30 text-indigo-600 focus:ring-indigo-500/30 accent-indigo-500"
                        />
                        <div className="leading-tight">
                            <span className="font-semibold block">
                                Đăng ẩn danh
                            </span>
                            <span className="text-[10px] text-slate-400">
                                Che tên với các học sinh khác
                            </span>
                        </div>
                    </label>

                    <div className="flex items-center gap-2.5 sm:self-auto w-full sm:w-auto">
                        <button
                            disabled={isPending}
                            onClick={submit}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition shadow-lg shadow-indigo-600/10 disabled:opacity-50"
                        >
                            {isPending ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Đăng bài viết
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Feedback alerts */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-3 text-xs">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl p-3 text-xs flex items-center gap-2 animate-pulse">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        {successMsg}
                    </div>
                )}
            </div>
        </div>
    );
}
