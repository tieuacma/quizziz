"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultTransition, fadeUp, usePrefersReducedMotion } from "./motion";

export default function LandingCTA() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        className="rounded-3xl bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-white/10 p-10 sm:p-16 text-center"
        variants={reduced ? undefined : fadeUp}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={defaultTransition}
      >
        <GraduationCap className="w-12 h-12 text-violet-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
        <p className="text-slate-400 max-w-lg mx-auto mb-8">
          Tham gia cùng hàng nghìn giáo viên và học sinh đang sử dụng Zenith
          EDU mỗi ngày.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-[#05040f] hover:bg-slate-200 font-semibold px-8"
            >
              Tạo tài khoản miễn phí
            </Button>
          </Link>
          <Link
            href="/login"
            className="text-sm text-slate-400 hover:text-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded px-2 py-1"
          >
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
