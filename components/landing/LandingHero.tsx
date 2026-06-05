"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultTransition,
  fadeUp,
  staggerContainer,
  usePrefersReducedMotion,
} from "./motion";

function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="group relative"
    >
      {/* Glow background */}
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-500/20 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="relative rounded-3xl zenith-glass shadow-2xl shadow-violet-900/50 overflow-hidden ring-1 ring-violet-500/30 backdrop-blur-xl">
        <div className="flex h-[300px] sm:h-[360px]">
          {/* Sidebar */}
          <aside className="w-16 sm:w-20 border-r border-white/10 bg-gradient-to-b from-violet-950/40 to-purple-950/40 p-3 sm:p-4 flex flex-col gap-3 justify-between">
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 mx-auto shadow-lg shadow-violet-600/50 flex items-center justify-center">
                <span className="text-lg font-black text-white">Z</span>
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-8 w-full rounded-lg transition-all ${
                    i === 1 
                      ? "bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-violet-600/30" 
                      : "bg-white/[0.06] hover:bg-white/[0.12]"
                  }`}
                />
              ))}
            </div>
            <div className="h-8 w-full rounded-lg bg-white/[0.06]" />
          </aside>

          {/* Main content */}
          <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-4 w-32 rounded bg-gradient-to-r from-violet-300 to-purple-300" />
                <div className="h-3 w-24 rounded bg-white/10" />
              </div>
              <div className="h-8 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-600/30" />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-400/30 p-4 hover:from-violet-500/30 hover:to-purple-500/20 transition-all"
              >
                <p className="text-[11px] text-slate-300 mb-2 font-medium">Lớp học</p>
                <p className="text-xl font-black text-white">5</p>
                <p className="text-[11px] text-emerald-300 mt-2 font-semibold">↑ 2 tuần này</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/10 border border-fuchsia-400/30 p-4 hover:from-fuchsia-500/30 hover:to-cyan-500/20 transition-all"
              >
                <p className="text-[11px] text-slate-300 mb-2 font-medium">Học sinh</p>
                <p className="text-xl font-black text-white">156</p>
                <p className="text-[11px] text-cyan-300 mt-2 font-semibold">Tất cả lớp</p>
              </motion.div>
            </div>

            {/* Recent quiz card */}
            <div className="rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/15 p-3 backdrop-blur-sm hover:from-white/[0.12] hover:to-white/[0.06] transition-all">
              <p className="text-[11px] text-slate-400 mb-3 font-medium uppercase tracking-wider">Quiz Gần Đây</p>
              <div className="space-y-2.5">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-violet-600/30 group-hover:shadow-violet-600/50 transition-shadow">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-violet-200 transition-colors">
                        {i === 1 ? "Web Development" : "Data Structure"}
                      </p>
                      <p className="text-[11px] text-slate-500">{24 + i * 8} bài · Tb {8 + i * 0.5}</p>
                    </div>
                    <div className="text-xs font-bold text-emerald-400">✓</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingHero() {
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const blobY1 = useTransform(scrollY, [0, 400], [0, reduced ? 0 : 80]);
  const blobY2 = useTransform(scrollY, [0, 400], [0, reduced ? 0 : -60]);
  const blobOpacity = useTransform(scrollY, [0, 300], [1, reduced ? 1 : 0.4]);

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
      {/* Enhanced background grid and blobs */}
      <div className="pointer-events-none absolute inset-0 zenith-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0">
        {/* Animated gradient blobs */}
        <motion.div
          style={{ y: blobY1, opacity: blobOpacity }}
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-violet-600 via-purple-500 to-transparent blur-[150px] opacity-50"
        />
        <motion.div
          style={{ y: blobY2, opacity: blobOpacity }}
          className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-t from-cyan-600 via-blue-500 to-transparent blur-[150px] opacity-30"
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-600 to-transparent blur-[120px] animate-[pulse-glow_8s_ease-in-out_infinite] opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            variants={reduced ? undefined : staggerContainer}
            initial={reduced ? false : "hidden"}
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              variants={reduced ? undefined : fadeUp}
              transition={defaultTransition}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full zenith-glass text-sm font-medium text-slate-200 mb-8 shadow-lg shadow-violet-900/30 border border-violet-500/20 backdrop-blur-xl hover:border-violet-500/40 transition-all"
            >
              <div className="flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-violet-300 animate-[shimmer_2.5s_ease-in-out_infinite]" />
              </div>
              <span>Nền tảng quản lý học tập toàn diện</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={reduced ? undefined : fadeUp}
              transition={defaultTransition}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.15]"
            >
              Nâng tầm{" "}
              <span className="zenith-gradient-text block">
                trải nghiệm học tập
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={reduced ? undefined : fadeUp}
              transition={defaultTransition}
              className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 mb-6 leading-relaxed font-light"
            >
              Công cụ tất cả trong một cho giáo viên và học sinh: tạo quiz tương tác, theo dõi tiến độ với analytics toàn diện — và mang trải nghiệm học tập theo phong cách game vào lớp học.
            </motion.p>

            {/* Hero highlights */}
            <motion.div
              variants={reduced ? undefined : fadeUp}
              transition={defaultTransition}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-sm hover:bg-white/[0.08] transition-colors">
                <span className="text-violet-300">⚡</span>
                <span className="text-sm font-semibold text-white">Quiz real-time &amp; điểm số cập nhật tức thì</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-sm hover:bg-white/[0.08] transition-colors">
                <span className="text-violet-300">📊</span>
                <span className="text-sm font-semibold text-white">Analytics giúp giáo viên nắm kết quả nhanh</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-sm hover:bg-white/[0.08] transition-colors">
                <span className="text-violet-300">🎮</span>
                <span className="text-sm font-semibold text-white">Trải nghiệm học tập theo kiểu game-based</span>
              </div>
            </motion.div>


            {/* CTA Buttons */}
            <motion.div
              variants={reduced ? undefined : fadeUp}
              transition={defaultTransition}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="zenith-btn-glow rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 text-white border-0 px-8 py-6 text-base font-semibold shadow-xl shadow-violet-600/40 hover:shadow-violet-500/60 transition-all w-full sm:w-auto group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Bắt đầu miễn phí
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-white/20 hover:bg-white/[0.1] hover:border-white/30 text-white px-8 py-6 text-base font-semibold backdrop-blur-sm w-full sm:w-auto transition-all"
                >
                  Đăng nhập
                </Button>
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={reduced ? undefined : fadeUp}
              transition={defaultTransition}
              className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8"
            >
              <div className="text-center sm:text-left">
                <p className="text-sm text-slate-400 mb-2">Tin tưởng bởi</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
                  <span className="text-sm font-semibold text-white">2,500+ người dùng</span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <div className="text-center sm:text-left">
                <p className="text-sm text-slate-400 mb-2">Được đánh giá</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <span className="text-sm font-semibold text-white">4.8/5 sao</span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <div className="text-center sm:text-left">
                <p className="text-sm text-slate-400 mb-2">Trường học</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏫</span>
                  <span className="text-sm font-semibold text-white">120+ đối tác</span>
                </div>
              </div>
            </motion.div>

            {/* Quick feature highlights */}
            <motion.div
              variants={reduced ? undefined : fadeUp}
              transition={defaultTransition}
              className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { icon: "⚡", label: "Real-time", desc: "Đồng bộ <50ms" },
                { icon: "🔒", label: "Bảo mật", desc: "SSL & GDPR" },
                { icon: "📱", label: "Responsive", desc: "Mọi thiết bị" },
                { icon: "🎯", label: "Dễ dùng", desc: "Không cần đào tạo" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center sm:items-start gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/20 hover:bg-white/[0.06] transition-all"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-semibold text-white">{item.label}</span>
                  <span className="text-[10px] text-slate-500">{item.desc}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Dashboard mockup */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...defaultTransition, delay: reduced ? 0 : 0.3 }}
            className="relative hidden lg:block"
          >
            <DashboardMockup />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.a
          href="#stats"
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center mt-16 text-slate-500 hover:text-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded-full"
          aria-label="Cuộn xuống"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.a>
      </div>
    </section>
  );
}
