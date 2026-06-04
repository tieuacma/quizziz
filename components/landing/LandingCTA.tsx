"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultTransition, fadeUp, usePrefersReducedMotion } from "./motion";

export default function LandingCTA() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        className="zenith-cta-banner rounded-3xl p-10 sm:p-16 text-center relative"
        variants={reduced ? undefined : fadeUp}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={defaultTransition}
      >
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 ring-1 ring-white/20 mb-6 mx-auto">
            <GraduationCap className="w-7 h-7 text-violet-200" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4 text-white">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-slate-300 max-w-lg mx-auto mb-8 text-base">
            Tham gia cùng hàng nghìn giáo viên và học sinh đang sử dụng Zenith
            EDU mỗi ngày.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="zenith-btn-glow rounded-xl bg-white text-[#030208] hover:bg-violet-50 font-bold px-8 shadow-xl border-0"
              >
                <Sparkles className="w-4 h-4 mr-2 text-violet-600" />
                Tạo tài khoản miễn phí
              </Button>
            </Link>
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded-lg px-3 py-2"
            >
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
