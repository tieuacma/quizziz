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
    <div className="relative rounded-2xl zenith-glass shadow-2xl shadow-violet-900/30 overflow-hidden ring-1 ring-violet-500/20">
      <div className="flex h-[280px] sm:h-[320px]">
        <aside className="w-14 sm:w-16 border-r border-white/8 bg-[#07060f]/80 p-2 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 mx-auto" />
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-7 rounded-md ${i === 1 ? "bg-violet-600/30" : "bg-white/5"}`}
            />
          ))}
        </aside>
        <div className="flex-1 p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-6 w-16 rounded-full bg-violet-600/20 border border-violet-500/30" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.04] border border-white/8 p-3">
              <p className="text-[10px] text-slate-500 mb-1">Lớp học</p>
              <p className="text-sm font-bold text-white">3</p>
              <p className="text-[10px] text-emerald-400 mt-1">+1 tuần này</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] border border-white/8 p-3">
              <p className="text-[10px] text-slate-500 mb-1">Học sinh</p>
              <p className="text-sm font-bold text-white">103</p>
              <p className="text-[10px] text-violet-400 mt-1">K22A, K22B</p>
            </div>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/8 p-2.5 space-y-2">
            <p className="text-[10px] text-slate-500">Quiz gần đây</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-xs">
                Q
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  HTTP Methods & Status
                </p>
                <p className="text-[10px] text-slate-500">32 bài nộp · TB 8.1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-purple-500/10 pointer-events-none" />
    </div>
  );
}

export default function LandingHero() {
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const blobY1 = useTransform(scrollY, [0, 400], [0, reduced ? 0 : 80]);
  const blobY2 = useTransform(scrollY, [0, 400], [0, reduced ? 0 : -60]);
  const blobOpacity = useTransform(scrollY, [0, 300], [1, reduced ? 1 : 0.4]);

  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 zenith-grid opacity-60" />
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: blobY1, opacity: blobOpacity }}
          className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[140px]"
        />
        <motion.div
          style={{ y: blobY2, opacity: blobOpacity }}
          className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px]"
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full bg-fuchsia-600/10 blur-[100px] animate-[pulse-glow_6s_ease-in-out_infinite]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            variants={reduced ? undefined : staggerContainer}
            initial={reduced ? false : "hidden"}
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={reduced ? undefined : fadeUp}
              transition={defaultTransition}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full zenith-glass text-sm text-slate-200 mb-6 shadow-lg shadow-violet-900/20"
            >
              <Sparkles className="w-4 h-4 text-violet-300 animate-[shimmer_2.5s_ease-in-out_infinite]" />
              Hệ thống quản lý học tập thông minh
            </motion.div>

            <motion.h1
              variants={reduced ? undefined : fadeUp}
              transition={defaultTransition}
              className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight mb-6 leading-[1.1]"
            >
              Nâng tầm{" "}
              <span className="zenith-gradient-text block sm:inline">
                trải nghiệm học tập
              </span>
            </motion.h1>

            <motion.p
              variants={reduced ? undefined : fadeUp}
              transition={defaultTransition}
              className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Zenith EDU giúp giáo viên và học sinh kết nối, quản lý khóa học và
              theo dõi tiến độ một cách hiệu quả.
            </motion.p>

            <motion.div
              variants={reduced ? undefined : fadeUp}
              transition={defaultTransition}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="zenith-btn-glow rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 text-white border-0 px-8 w-full sm:w-auto"
                >
                  Bắt đầu ngay <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-white/15 hover:bg-white/[0.08] hover:border-white/25 text-white px-8 w-full sm:w-auto backdrop-blur-sm"
                >
                  Đăng nhập
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...defaultTransition, delay: reduced ? 0 : 0.2 }}
            className="relative"
          >
            <DashboardMockup />
          </motion.div>
        </div>

        <a
          href="#stats"
          className="flex justify-center mt-12 text-slate-500 hover:text-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded-full"
          aria-label="Cuộn xuống"
        >
          <ChevronDown
            className={`w-6 h-6 ${reduced ? "" : "animate-bounce"}`}
          />
        </a>
      </div>
    </section>
  );
}
