"use client";

import { motion } from "framer-motion";
import { STEPS } from "./landing-data";
import {
  defaultTransition,
  fadeUp,
  staggerContainer,
  usePrefersReducedMotion,
} from "./motion";

export default function LandingHowItWorks() {
  const reduced = false;

  return (
    <section
      id="huong-dan"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 overflow-hidden"
      aria-labelledby="how-heading"
    >
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-violet-600/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-1/2 right-0 w-96 h-96 rounded-full bg-gradient-to-bl from-cyan-600/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative text-center mb-16 sm:mb-20">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={defaultTransition}
        >
          <p className="text-sm font-semibold text-violet-300 uppercase tracking-widest mb-4">
            Hướng Dẫn
          </p>
          <h2 
            id="how-heading" 
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          >
            Bắt đầu trong{" "}
            <span className="zenith-gradient-text block">
              ba bước đơn giản
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Hành trình học tập của bạn chỉ cần ba bước để khởi động, từ đăng ký đến tương tác đầu tiên.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="relative grid sm:grid-cols-3 gap-12 sm:gap-8"
        variants={reduced ? undefined : staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {/* Connecting line */}
        <div
          className="hidden sm:block absolute top-24 left-[8%] right-[8%] h-1 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent -z-10"
          aria-hidden
        />

        {STEPS.map((step, index) => (
          <motion.div
            key={step.step}
            variants={reduced ? undefined : fadeUp}
            transition={defaultTransition}
            className="group relative flex flex-col items-center text-center"
          >
            {/* Step card glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent group-hover:from-violet-500/20 group-hover:via-purple-500/15 transition-all duration-500 -z-10 blur-xl" />

            {/* Step number badge */}
            <motion.div
              whileHover={reduced ? undefined : { scale: 1.1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-600/40 mb-6 z-10 group-hover:shadow-purple-600/60 transition-shadow ring-1 ring-white/20"
            >
              {step.step}
            </motion.div>

            {/* Content */}
            <div className="p-6 rounded-2xl border border-white/10 group-hover:border-violet-500/20 bg-white/[0.02] group-hover:bg-white/[0.06] backdrop-blur-sm transition-all h-full">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-100 transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                {step.desc}
              </p>
            </div>

            {/* Step indicator for mobile */}
            {index < STEPS.length - 1 && (
              <div className="sm:hidden mt-6 w-px h-8 bg-gradient-to-b from-violet-500/40 to-transparent" />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom feature highlight */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ...defaultTransition, delay: 0.4 }}
        className="mt-20 pt-12 border-t border-white/10"
      >
        <div className="text-center">
          <p className="text-slate-400 mb-6">
            ⚡ Quản lý lớp học, tạo quiz, và xem kết quả ngay lập tức — tất cả trong một nền tảng
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 hover:border-violet-500/40 transition-all hover:bg-gradient-to-r hover:from-violet-600/30 hover:to-purple-600/30 cursor-pointer">
            <span className="text-sm font-semibold text-violet-300">Xem video hướng dẫn</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
