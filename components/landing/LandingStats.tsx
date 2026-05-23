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
  label,
  reduced,
}: {
  value: number;
  suffix: string;
  label: string;
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
    <div ref={ref} className="text-center px-4">
      <div className="min-h-[3rem] flex items-end justify-center gap-0.5">
        <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
          {shown}
        </span>
        <span className="text-3xl sm:text-4xl font-bold text-violet-400">
          {suffix}
        </span>
      </div>
      <p className="text-sm text-slate-400 mt-2">{label}</p>
    </div>
  );
}

export default function LandingStats() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="stats"
      className="border-y border-white/8 bg-white/[0.02] py-14 sm:py-16"
      aria-labelledby="stats-heading"
    >
      <h2 id="stats-heading" className="sr-only">
        Thống kê nền tảng
      </h2>
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8"
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
          >
            <AnimatedStat
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              reduced={reduced}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
