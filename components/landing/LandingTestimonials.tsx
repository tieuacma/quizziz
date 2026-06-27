"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TESTIMONIALS } from "./landing-data";
import { Star } from "lucide-react";
import {
  defaultTransition,
  fadeUp,
  staggerContainer,
  usePrefersReducedMotion,
} from "./motion";

export default function LandingTestimonials() {
  const reduced = false;

  return (
    <section
      id="danh-gia"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 -left-1/4 w-96 h-96 rounded-full bg-violet-600/5 blur-3xl" />
        <div className="absolute bottom-1/3 -right-1/4 w-96 h-96 rounded-full bg-fuchsia-600/5 blur-3xl" />
      </div>

      <div className="relative text-center mb-16 sm:mb-20">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={defaultTransition}
        >
          <p className="text-sm font-semibold text-violet-300 uppercase tracking-widest mb-4">
            Đánh Giá Thực Tế
          </p>
          <h2
            id="testimonials-heading"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          >
            Tin dùng bởi hàng ngàn{" "}
            <span className="zenith-gradient-text block">
              giáo viên & học sinh
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Khám phá trải nghiệm dạy và học thực tế của cộng đồng giáo dục khi
            ứng dụng giải pháp của Zenith EDU.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="grid md:grid-cols-3 gap-8 lg:gap-10"
        variants={reduced ? undefined : staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {TESTIMONIALS.map((t) => (
          <motion.div
            key={t.name}
            variants={reduced ? undefined : fadeUp}
            transition={defaultTransition}
            className="group relative h-full"
          >
            {/* Glow background on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 via-purple-500/0 to-fuchsia-500/0 group-hover:from-violet-500/10 group-hover:via-purple-500/5 group-hover:to-fuchsia-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />

            <Card className="h-full zenith-card border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm shadow-none group transition-all duration-300 hover:border-violet-500/20">
              <CardContent className="p-8 flex flex-col justify-between h-full relative z-10">
                {/* SVG Quote Icon Decorator */}
                <div className="absolute top-6 right-8 text-white/5 group-hover:text-violet-500/10 transition-colors pointer-events-none">
                  <svg
                    width="45"
                    height="36"
                    viewBox="0 0 45 36"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 0C4.477 0 0 4.477 0 10V26C0 31.523 4.477 36 10 36H12V26H10V10H20V0H10ZM35 0C29.477 0 25 4.477 25 10V26C25 31.523 29.477 36 35 36H37V26H35V10H45V0H35Z" />
                  </svg>
                </div>

                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, sIdx) => (
                      <Star
                        key={sIdx}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400 shadow-sm"
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-300 italic leading-relaxed text-sm sm:text-base mb-8 group-hover:text-slate-200 transition-colors">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Profile detail */}
                <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all shadow-md"
                    loading="lazy"
                    unoptimized
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm sm:text-base truncate group-hover:text-violet-100 transition-colors">
                      {t.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 group-hover:text-slate-300 transition-colors truncate">
                      {t.role}
                    </p>
                    <p className="text-[10px] text-violet-300 font-medium truncate mt-0.5">
                      {t.school}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
