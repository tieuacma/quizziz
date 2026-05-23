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
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="huong-dan"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24"
      aria-labelledby="how-heading"
    >
      <div className="text-center mb-16">
        <h2 id="how-heading" className="text-3xl sm:text-4xl font-bold mb-4">
          Cách hoạt động
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Ba bước đơn giản để bắt đầu hành trình học tập trên Zenith EDU.
        </p>
      </div>

      <motion.ol
        className="relative grid sm:grid-cols-3 gap-8 sm:gap-6"
        variants={reduced ? undefined : staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <div
          className="hidden sm:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
          aria-hidden
        />
        {STEPS.map((step) => (
          <motion.li
            key={step.step}
            variants={reduced ? undefined : fadeUp}
            transition={defaultTransition}
            className="relative flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-purple-600/30 mb-5 z-10">
              {step.step}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {step.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {step.desc}
            </p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
