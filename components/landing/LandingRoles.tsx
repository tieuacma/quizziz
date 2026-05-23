"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ROLES } from "./landing-data";
import { cn } from "@/lib/utils";
import { defaultTransition, usePrefersReducedMotion } from "./motion";

type RoleKey = keyof typeof ROLES;

export default function LandingRoles() {
  const [active, setActive] = useState<RoleKey>("teacher");
  const reduced = usePrefersReducedMotion();
  const role = ROLES[active];

  return (
    <section
      id="vai-tro"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24"
      aria-labelledby="roles-heading"
    >
      <div className="text-center mb-12">
        <h2
          id="roles-heading"
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Dành cho từng vai trò
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Zenith EDU tối ưu trải nghiệm cho cả giáo viên và học sinh.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-10">
        {(Object.keys(ROLES) as RoleKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
              active === key
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-600/25"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/8 border border-white/8"
            )}
          >
            {ROLES[key].label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -12 }}
          transition={defaultTransition}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-white mb-3">{role.title}</h3>
          <p className="text-slate-400 mb-8 leading-relaxed">{role.description}</p>
          <ul className="space-y-4">
            {role.bullets.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-slate-300 pt-2">{item.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
