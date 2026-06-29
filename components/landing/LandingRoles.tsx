"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ROLES } from "./landing-data";
import { cn } from "@/lib/utils";
import { defaultTransition, usePrefersReducedMotion } from "./motion";

type RoleKey = keyof typeof ROLES;

export default function LandingRoles() {
  const [active, setActive] = useState<RoleKey>("teacher");
  const reduced = false;
  const role = ROLES[active];

  return (
    <section
      id="vai-tro"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 overflow-hidden"
      aria-labelledby="roles-heading"
    >
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-bl from-violet-600/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-600/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative text-center mb-12 sm:mb-16">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={defaultTransition}
        >
          <p className="text-sm font-semibold text-violet-300 uppercase tracking-widest mb-4">
            Dành Cho Mọi Người
          </p>
          <h2
            id="roles-heading"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          >
            Tối ưu cho{" "}
            <span className="zenith-gradient-text block">
              mỗi vai trò
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Dù bạn là giáo viên hay học sinh, Zenith EDU được thiết kế để đáp ứng nhu cầu riêng của bạn.
          </p>
        </motion.div>
      </div>

      {/* Role selector buttons */}
      <div className="flex justify-center gap-3 mb-12 sm:mb-16 flex-wrap">
        {(Object.keys(ROLES) as RoleKey[]).map((key) => (
          <motion.button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={defaultTransition}
            className={cn(
              "px-7 py-3 rounded-full text-base font-semibold transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
              "transform hover:scale-105",
              active === key
                ? "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-xl shadow-purple-600/40 border border-violet-500/50"
                : "bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.1] border border-white/10 hover:border-white/20 backdrop-blur-sm"
            )}
          >
            {ROLES[key].label}
          </motion.button>
        ))}
      </div>

      {/* Content card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={reduced ? false : { opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0, y: -20, scale: 0.98 }}
          transition={defaultTransition}
          className="relative"
        >
          {/* Card glow background */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-fuchsia-500/5 blur-2xl -z-10" />

          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:p-12 lg:p-16 max-w-4xl mx-auto backdrop-blur-xl hover:border-violet-500/30 transition-all duration-300">
            {/* Role title */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...defaultTransition, delay: 0.1 }}
              className="mb-8"
            >
              <p className="text-violet-300 text-sm font-semibold uppercase tracking-widest mb-3">
                {ROLES[active].label}
              </p>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
                {role.title}
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                {role.description}
              </p>
            </motion.div>

            {/* Features list */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...defaultTransition, delay: 0.2 }}
              className="space-y-4"
            >
              {role.bullets.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={reduced ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...defaultTransition, delay: 0.2 + index * 0.05 }}
                  className="flex items-start gap-4 group p-4 rounded-xl hover:bg-white/[0.05] transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-600/20 flex items-center justify-center shrink-0 group-hover:from-violet-600/50 group-hover:to-purple-600/40 transition-all shadow-lg shadow-violet-900/20 group-hover:shadow-violet-600/30">
                    <item.icon className="w-6 h-6 text-violet-300 group-hover:text-violet-200 transition-colors" />
                  </div>
                  <span className="text-slate-300 pt-2 font-medium group-hover:text-white transition-colors">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA button */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...defaultTransition, delay: 0.4 }}
              className="mt-10 pt-8 border-t border-white/10"
            >
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-violet-600/40 hover:shadow-violet-600/60 transition-all transform hover:scale-105">
                Bắt đầu với {ROLES[active].label.toLowerCase()}
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
