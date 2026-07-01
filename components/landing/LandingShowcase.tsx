"use client";

import { motion } from "framer-motion";
import {
    defaultTransition,
    fadeUp,
    staggerContainer,
    usePrefersReducedMotion,
} from "./motion";

function DashboardPanel() {
    return (
        <div className="h-full min-h-[280px] p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex gap-2">
                <div className="h-2.5 w-24 rounded bg-gradient-to-r from-violet-300 to-purple-300" />
                <div className="h-2.5 w-16 rounded bg-white/15" />
            </div>

            {/* Class cards */}
            <div className="grid grid-cols-3 gap-3 flex-1">
                {["K22A", "K22B", "K21"].map((c) => (
                    <motion.div
                        key={c}
                        whileHover={{ scale: 1.05 }}
                        className="rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/30 p-3 hover:from-violet-500/30 hover:to-purple-500/20 transition-all cursor-pointer"
                    >
                        <p className="text-[11px] text-violet-300 font-semibold mb-1">
                            {c}
                        </p>
                        <p className="text-sm text-white font-bold">38</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                            học sinh
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Analytics card */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="h-20 rounded-xl bg-gradient-to-r from-violet-600/25 to-purple-600/15 border border-violet-500/30 flex items-center px-4 gap-3 hover:from-violet-600/35 hover:to-purple-600/25 transition-all cursor-pointer"
            >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-600/30" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-bold">Analytics</p>
                    <p className="text-[11px] text-slate-300">
                        Điểm TB: 7.8 • ↑ 0.5 tuần này
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

function QuizPanel() {
    const options = [
        {
            label: "GET",
            color: "bg-emerald-500/25 border-emerald-500/50 text-emerald-300",
        },
        {
            label: "POST",
            color: "bg-violet-500/25 border-violet-500/50 text-violet-300",
        },
        {
            label: "PUT",
            color: "bg-amber-500/25 border-amber-500/50 text-amber-300",
        },
        {
            label: "DELETE",
            color: "bg-rose-500/25 border-rose-500/50 text-rose-300",
        },
    ];

    return (
        <div className="h-full min-h-[280px] p-6 flex flex-col">
            {/* Progress header */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-white">
                    Câu 3 / 10
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <span className="text-sm font-bold text-orange-400">
                        5 × streak
                    </span>
                </div>
            </div>

            {/* Score display */}
            <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/10 border border-violet-500/30">
                <p className="text-xs text-slate-400 mb-1">Điểm hiện tại</p>
                <p className="text-2xl font-black text-white">
                    1,240 <span className="text-lg text-slate-400">pts</span>
                </p>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-white/10 mb-5 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "30%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-violet-600/50"
                />
            </div>

            {/* Question */}
            <p className="text-sm font-bold text-white mb-5 leading-relaxed">
                Phương thức HTTP nào dùng để tạo tài nguyên mới?
            </p>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
                {options.map((opt) => (
                    <motion.button
                        key={opt.label}
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: "rgba(255,255,255,0.1)",
                        }}
                        className={`rounded-xl border px-4 py-3 text-center font-bold transition-all ${opt.color}`}
                    >
                        {opt.label}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

export default function LandingShowcase() {
    const reduced = false;

    return (
        <section
            className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 overflow-hidden"
            aria-labelledby="showcase-heading"
        >
            {/* Background elements */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-gradient-to-bl from-violet-600/10 via-transparent to-transparent blur-3xl" />
                <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-600/10 via-transparent to-transparent blur-3xl" />
            </div>

            <div className="relative text-center mb-16 sm:mb-20">
                <motion.div
                    initial={reduced ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={defaultTransition}
                >
                    <p className="text-sm font-semibold text-violet-300 uppercase tracking-widest mb-4">
                        Trải Nghiệm
                    </p>
                    <h2
                        id="showcase-heading"
                        className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
                    >
                        Giao diện{" "}
                        <span className="zenith-gradient-text block">
                            hiện đại & trực quan
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Dashboard quản lý lớp học và quiz game tương tác — thiết
                        kế đẹp mắt, dễ sử dụng, tối ưu cho mọi thiết bị.
                    </p>
                </motion.div>
            </div>

            <motion.div
                className="grid md:grid-cols-2 gap-8 lg:gap-10"
                variants={reduced ? undefined : staggerContainer}
                initial={reduced ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
            >
                {/* Dashboard card */}
                <motion.article
                    variants={reduced ? undefined : fadeUp}
                    transition={defaultTransition}
                    whileHover={reduced ? undefined : { y: -8 }}
                    className="group relative rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.06] to-white/[0.02] overflow-hidden hover:border-violet-500/30 transition-all shadow-xl shadow-violet-900/20 hover:shadow-violet-600/30"
                >
                    {/* Card glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                    {/* Header */}
                    <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent group-hover:from-white/[0.08] transition-all">
                        <h3 className="font-bold text-lg text-white mb-1">
                            📊 Dashboard Giáo viên
                        </h3>
                        <p className="text-sm text-slate-400">
                            Quản lý lớp • Analytics • Lịch biểu
                        </p>
                    </div>

                    {/* Content */}
                    <DashboardPanel />
                </motion.article>

                {/* Quiz card */}
                <motion.article
                    variants={reduced ? undefined : fadeUp}
                    transition={defaultTransition}
                    whileHover={reduced ? undefined : { y: -8 }}
                    className="group relative rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.06] to-white/[0.02] overflow-hidden hover:border-fuchsia-500/30 transition-all shadow-xl shadow-purple-900/20 hover:shadow-fuchsia-600/30"
                >
                    {/* Card glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-fuchsia-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                    {/* Header */}
                    <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent group-hover:from-white/[0.08] transition-all">
                        <h3 className="font-bold text-lg text-white mb-1">
                            🎮 Quiz Game Real-time
                        </h3>
                        <p className="text-sm text-slate-400">
                            Tương tác • Điểm số • Streaks
                        </p>
                    </div>

                    {/* Content */}
                    <QuizPanel />
                </motion.article>
            </motion.div>

            {/* Features highlight */}
            <motion.div
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...defaultTransition, delay: 0.4 }}
                className="mt-16 pt-12 border-t border-white/10"
            >
                <div className="grid sm:grid-cols-3 gap-8">
                    <div className="text-center sm:text-left">
                        <p className="text-3xl mb-2">⚡</p>
                        <p className="font-semibold text-white mb-1">
                            Siêu nhanh
                        </p>
                        <p className="text-sm text-slate-400">
                            Tải trong milliseconds, hoạt động mượt mà
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl mb-2">🛡️</p>
                        <p className="font-semibold text-white mb-1">An toàn</p>
                        <p className="text-sm text-slate-400">
                            Mã hóa end-to-end, tuân thủ GDPR
                        </p>
                    </div>
                    <div className="text-center sm:text-right">
                        <p className="text-3xl mb-2">📱</p>
                        <p className="font-semibold text-white mb-1">
                            Responsive
                        </p>
                        <p className="text-sm text-slate-400">
                            Hoàn hảo trên desktop, tablet, mobile
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
