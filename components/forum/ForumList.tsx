"use client";

import Link from "next/link";
import React, { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Search,
    Flame,
    Clock,
    Award,
    MessageSquare,
    ThumbsUp,
    Eye,
    ShieldAlert,
} from "lucide-react";

type PostSummary = {
    id: string;
    title: string;
    authorName?: string;
    anonymous: boolean;
    createdAt: string | Date;
    moderationStatus: string;
    meta?: {
        views?: number;
        voteScore?: number;
        commentCount?: number;
    };
    hasMath?: boolean;
    classScope?: { classId?: string; name?: string } | null;
};

export default function ForumList({ posts }: { posts: PostSummary[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentSearch = searchParams.get("search") ?? "";
    const currentSort = searchParams.get("sort") ?? "new";
    const [searchInput, setSearchInput] = useState(currentSearch);

    function updateQuery(name: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        // Chuyển hướng để Server Component tải lại dữ liệu mới
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        updateQuery("search", searchInput);
    }

    return (
        <div className="space-y-4">
            {/* Search & Sort Panel */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border border-white/8 bg-white/[0.02] p-3 rounded-2xl">
                <form
                    onSubmit={handleSearchSubmit}
                    className="relative w-full sm:max-w-md"
                >
                    <input
                        type="text"
                        className="w-full rounded-xl border border-white/10 bg-black/25 pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 outline-none focus:border-indigo-500/40 transition"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Tìm kiếm tiêu đề hoặc nội dung..."
                    />
                    <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                    <button type="submit" className="hidden">
                        Tìm
                    </button>
                </form>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                        onClick={() => updateQuery("sort", "new")}
                        disabled={isPending}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                            currentSort === "new"
                                ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-300"
                                : "border-white/10 text-slate-300 hover:bg-white/[0.04]"
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        Mới nhất
                    </button>
                    <button
                        onClick={() => updateQuery("sort", "hot")}
                        disabled={isPending}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                            currentSort === "hot"
                                ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-300"
                                : "border-white/10 text-slate-300 hover:bg-white/[0.04]"
                        }`}
                    >
                        <Flame className="w-3.5 h-3.5" />
                        Nổi bật
                    </button>
                    <button
                        onClick={() => updateQuery("sort", "top")}
                        disabled={isPending}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                            currentSort === "top"
                                ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-300"
                                : "border-white/10 text-slate-300 hover:bg-white/[0.04]"
                        }`}
                    >
                        <Award className="w-3.5 h-3.5" />
                        Bình chọn
                    </button>
                </div>
            </div>

            {/* Posts List */}
            <div className="space-y-3">
                {posts.length === 0 ? (
                    <div className="border border-white/6 bg-white/[0.01] rounded-2xl p-8 text-center text-slate-400 text-sm">
                        {isPending
                            ? "Đang tải bài viết..."
                            : "Không tìm thấy bài viết nào phù hợp."}
                    </div>
                ) : (
                    posts.map((p) => {
                        const hasClass = p.classScope && p.classScope.name;
                        const views = p.meta?.views ?? 0;
                        const voteScore = p.meta?.voteScore ?? 0;
                        const comments = p.meta?.commentCount ?? 0;

                        return (
                            <Link
                                key={p.id}
                                href={`/dashboard/student/forum/posts/${p.id}`}
                                className="block border border-white/8 bg-white/[0.02] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/12 transition-all relative overflow-hidden group"
                            >
                                {/* Visual Glow on Hover */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition" />

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {hasClass && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300">
                                                        {p.classScope?.name}
                                                    </span>
                                                )}
                                                {p.hasMath && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300">
                                                        LaTeX
                                                    </span>
                                                )}
                                                {p.moderationStatus !==
                                                    "approved" && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 flex items-center gap-1">
                                                        <ShieldAlert className="w-3 h-3" />
                                                        {p.moderationStatus ===
                                                        "pending"
                                                            ? "Chờ duyệt"
                                                            : "Bị chặn"}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="text-white text-base font-bold group-hover:text-indigo-200 transition line-clamp-1">
                                                {p.title}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Meta Bar */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/6 pt-3 mt-1">
                                        <div className="text-[11px] text-slate-400">
                                            Tác giả:{" "}
                                            <span
                                                className={
                                                    p.anonymous
                                                        ? "text-slate-400 italic"
                                                        : "text-slate-300 font-semibold"
                                                }
                                            >
                                                {p.authorName ??
                                                    (p.anonymous
                                                        ? "Học sinh ẩn danh"
                                                        : "Thành viên")}
                                            </span>
                                            {" • "}
                                            {new Date(
                                                p.createdAt
                                            ).toLocaleDateString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </div>

                                        <div className="flex items-center gap-3.5 text-xs text-slate-400 self-end sm:self-auto">
                                            <span className="flex items-center gap-1 hover:text-white transition">
                                                <Eye className="w-3.5 h-3.5" />
                                                {views}
                                            </span>
                                            <span className="flex items-center gap-1 hover:text-white transition">
                                                <ThumbsUp className="w-3.5 h-3.5" />
                                                {voteScore}
                                            </span>
                                            <span className="flex items-center gap-1 hover:text-white transition">
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                {comments}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
