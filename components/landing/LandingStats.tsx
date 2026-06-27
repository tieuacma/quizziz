"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import { STATS } from "./landing-data";
import {
  defaultTransition,
  fadeUp,
  staggerContainer,
  usePrefersReducedMotion,
} from "./motion";

function AnimatedStat({
  value,
  suffix,
  reduced,
}: {
  value: number;
  suffix: string;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const spring = useSpring(0, { stiffness: 60, damping: 18 });
  const [displayValue, setDisplayValue] = useState(0);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  useEffect(() => {
    if (!inView || reduced) return;
    spring.set(value);
  }, [inView, value, spring, reduced]);

  const shown = reduced ? value : displayValue;

  return (
    <div ref={ref}>
      <span>{shown}</span>
      <span className="font-display text-4xl sm:text-5xl font-extrabold zenith-gradient-text ml-1">
        {suffix}
      </span>
    </div>
  );
}

export default function LandingStats() {
  const reduced = false;

  return (
    <section
      id="stats"
      className="relative border-y border-white/10 py-16 sm:py-20 overflow-hidden"
      aria-labelledby="stats-heading"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-cyan-600/5" />

      <h2 id="stats-heading" className="sr-only">
        Thống kê nền tảng
      </h2>
      
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        variants={reduced ? undefined : staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={reduced ? undefined : fadeUp}
            transition={defaultTransition}
            className="group relative"
          >
            {/* Card glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 group-hover:from-violet-500/20 group-hover:via-purple-500/15 group-hover:to-fuchsia-500/20 transition-all duration-500 -z-10 blur-xl" />

            <div className="relative p-6 sm:p-8 rounded-2xl border border-white/10 group-hover:border-violet-500/20 transition-all backdrop-blur-sm bg-white/[0.02] hover:bg-white/[0.06]">
              <div className="flex flex-col">
                <div className="flex items-end justify-center gap-0.5 min-h-[3rem] mb-3">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-white tabular-nums group-hover:text-violet-100 transition-colors">
                    <AnimatedStat
                      value={stat.value}
                      suffix={stat.suffix}
                      reduced={reduced}
                    />
                  </span>
                </div>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors text-center font-medium">
                  {stat.label}
                </p>
              </div>

              {/* Decorative icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
