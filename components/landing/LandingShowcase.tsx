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
    <div className="h-full min-h-[220px] p-4 flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="h-2 w-20 rounded bg-white/15" />
        <div className="h-2 w-12 rounded bg-white/8" />
      </div>
      <div className="grid grid-cols-3 gap-2 flex-1">
        {["K22A", "K22B", "K21"].map((c) => (
          <div
            key={c}
            className="rounded-lg bg-white/[0.04] border border-white/8 p-2"
          >
            <p className="text-[10px] text-violet-400 font-medium">{c}</p>
            <p className="text-xs text-white mt-1 font-semibold">38 HS</p>
          </div>
        ))}
      </div>
      <div className="h-16 rounded-lg bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-white/8 flex items-center px-3 gap-2">
        <div className="w-8 h-8 rounded-full bg-violet-500/30" />
        <div>
          <p className="text-xs text-white font-medium">Analytics</p>
          <p className="text-[10px] text-slate-500">Điểm TB lớp: 7.8</p>
        </div>
      </div>
    </div>
  );
}

function QuizPanel() {
  const options = [
    { label: "GET", color: "bg-emerald-500/20 border-emerald-500/40" },
    { label: "POST", color: "bg-violet-500/20 border-violet-500/40" },
    { label: "PUT", color: "bg-amber-500/20 border-amber-500/40" },
    { label: "DELETE", color: "bg-rose-500/20 border-rose-500/40" },
  ];

  return (
    <div className="h-full min-h-[220px] p-4 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-slate-500">Câu 3 / 10</span>
        <span className="text-xs font-bold text-violet-400">1,240 pts</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 mb-4 overflow-hidden">
        <div className="h-full w-[30%] rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
      </div>
      <p className="text-sm font-semibold text-white mb-4">
        Phương thức HTTP nào dùng để tạo tài nguyên mới?
      </p>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {options.map((opt) => (
          <div
            key={opt.label}
            className={`rounded-xl border px-3 py-3 text-center text-sm font-bold text-white ${opt.color}`}
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingShowcase() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
      aria-labelledby="showcase-heading"
    >
      <div className="text-center mb-12">
        <h2 id="showcase-heading" className="text-3xl sm:text-4xl font-bold mb-4">
          Trải nghiệm sản phẩm
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Dashboard quản lý và quiz game tương tác — thiết kế nhất quán, hiện đại.
        </p>
      </div>

      <motion.div
        className="grid md:grid-cols-2 gap-6"
        variants={reduced ? undefined : staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <motion.article
          variants={reduced ? undefined : fadeUp}
          transition={defaultTransition}
          whileHover={reduced ? undefined : { scale: 1.02 }}
          className="rounded-3xl border border-white/10 bg-[#0a0918]/80 overflow-hidden hover:border-violet-500/30 transition-colors shadow-xl shadow-purple-900/10"
        >
          <div className="px-5 py-4 border-b border-white/8">
            <h3 className="font-semibold text-white">Dashboard Giáo viên</h3>
            <p className="text-sm text-slate-500">Lớp học, học sinh, analytics</p>
          </div>
          <DashboardPanel />
        </motion.article>

        <motion.article
          variants={reduced ? undefined : fadeUp}
          transition={defaultTransition}
          whileHover={reduced ? undefined : { scale: 1.02 }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/50 to-emerald-950/30 overflow-hidden hover:border-violet-500/30 transition-colors shadow-xl shadow-purple-900/10"
        >
          <div className="px-5 py-4 border-b border-white/8">
            <h3 className="font-semibold text-white">Quiz Game</h3>
            <p className="text-sm text-slate-500">Real-time, điểm số, streak</p>
          </div>
          <QuizPanel />
        </motion.article>
      </motion.div>
    </section>
  );
}
