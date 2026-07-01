"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    defaultTransition,
    fadeUp,
    staggerContainer,
    usePrefersReducedMotion,
} from "./motion";

export default function LandingCTA() {
    const reduced = false;

    return (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 overflow-hidden">
            {/* Background decorations */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-transparent blur-3xl" />
            </div>

            <motion.div
                className="relative rounded-3xl p-12 sm:p-16 lg:p-20 text-center overflow-hidden"
                variants={reduced ? undefined : staggerContainer}
                initial={reduced ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
            >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-purple-600/10 to-fuchsia-600/5 -z-20" />
                <div className="absolute inset-0 border border-white/15 rounded-3xl -z-10" />

                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-bl from-violet-600/20 to-transparent blur-3xl -z-10 opacity-50" />
                <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-600/10 to-transparent blur-3xl -z-10 opacity-50" />

                <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                        variants={reduced ? undefined : fadeUp}
                        transition={defaultTransition}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-purple-500/20 ring-1 ring-violet-500/30 mb-8 mx-auto shadow-lg shadow-violet-600/30"
                    >
                        <Sparkles className="w-8 h-8 text-violet-300" />
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        variants={reduced ? undefined : fadeUp}
                        transition={defaultTransition}
                        className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-tight"
                    >
                        Sẵn sàng nâng tầm{" "}
                        <span className="zenith-gradient-text">
                            trải nghiệm?
                        </span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        variants={reduced ? undefined : fadeUp}
                        transition={defaultTransition}
                        className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg leading-relaxed"
                    >
                        Tham gia cùng hàng nghìn giáo viên và học sinh đang sử
                        dụng Zenith EDU để quản lý khóa học, tạo quiz tương tác,
                        và theo dõi tiến độ học tập mỗi ngày.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={reduced ? undefined : fadeUp}
                        transition={defaultTransition}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                    >
                        <Link href="/signup">
                            <Button
                                size="lg"
                                className="zenith-btn-glow rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 text-white border-0 px-8 py-6 text-base font-semibold shadow-xl shadow-violet-600/40 hover:shadow-violet-500/60 transition-all w-full sm:w-auto group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Bắt đầu miễn phí
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-xl border-white/20 hover:bg-white/[0.1] hover:border-white/30 text-white px-8 py-6 text-base font-semibold backdrop-blur-sm w-full sm:w-auto transition-all"
                            >
                                Đã có tài khoản? Đăng nhập
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust signal */}
                    <motion.p
                        variants={reduced ? undefined : fadeUp}
                        transition={defaultTransition}
                        className="mt-10 text-sm text-slate-400"
                    >
                        Không cần thẻ tín dụng • Cài đặt trong vài phút
                    </motion.p>
                </div>
            </motion.div>
        </section>
    );
}
