"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES } from "./landing-data";
import {
  defaultTransition,
  fadeUp,
  staggerContainer,
  usePrefersReducedMotion,
} from "./motion";

export default function LandingFeatures() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="tinh-nang"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24"
      aria-labelledby="features-heading"
    >
      <div className="text-center mb-16">
        <h2 id="features-heading" className="font-display text-3xl sm:text-4xl font-extrabold mb-4">
          Tính năng{" "}
          <span className="zenith-gradient-text-static">nổi bật</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Mọi thứ bạn cần để quản lý và nâng cao chất lượng giảng dạy, học
          tập.
        </p>
      </div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={reduced ? undefined : staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            variants={reduced ? undefined : fadeUp}
            transition={defaultTransition}
            whileHover={
              reduced ? undefined : { y: -4, transition: { duration: 0.2 } }
            }
          >
            <Card className="h-full zenith-card border-0 bg-transparent shadow-none group">
              <CardContent className="p-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/25 to-fuchsia-600/20 flex items-center justify-center mb-4 ring-1 ring-violet-500/20 group-hover:from-violet-500/35 group-hover:to-fuchsia-600/30 transition-all shadow-lg shadow-violet-900/20">
                  <f.icon className="w-6 h-6 text-violet-300" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
