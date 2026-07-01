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
    const reduced = false;

    return (
        <section
            id="tinh-nang"
            className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 overflow-hidden"
            aria-labelledby="features-heading"
        >
            {/* Background elements */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/4 -right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-violet-600/10 via-transparent to-transparent blur-3xl" />
                <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-600/10 via-transparent to-transparent blur-3xl" />
            </div>

            <div className="relative text-center mb-16 sm:mb-20">
                <motion.div
                    initial={reduced ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={defaultTransition}
                >
                    <p className="text-sm font-semibold text-violet-300 uppercase tracking-widest mb-4">
                        Các Tính Năng Chính
                    </p>
                    <h2
                        id="features-heading"
                        className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
                    >
                        Mọi thứ bạn cần{" "}
                        <span className="zenith-gradient-text block">
                            để thành công
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Từ tạo quiz tương tác đến quản lý lớp học, Zenith EDU
                        cung cấp tất cả công cụ cần thiết.
                    </p>
                </motion.div>
            </div>

            <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
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
                        className="group relative"
                    >
                        {/* Card glow background */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 via-purple-500/0 to-fuchsia-500/0 group-hover:from-violet-500/20 group-hover:via-purple-500/10 group-hover:to-fuchsia-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />

                        <Card className="h-full zenith-card border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm shadow-none group transition-all duration-300 hover:border-violet-500/20 hover:shadow-xl hover:shadow-violet-600/20">
                            <CardContent className="p-8 relative z-10 flex flex-col h-full">
                                {/* Icon container */}
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-fuchsia-500/10 flex items-center justify-center mb-6 ring-1 ring-violet-500/20 group-hover:from-violet-500/40 group-hover:via-purple-500/30 group-hover:to-fuchsia-500/20 group-hover:ring-violet-500/40 transition-all shadow-lg shadow-violet-900/20 group-hover:shadow-violet-600/30">
                                    <f.icon className="w-7 h-7 text-violet-300 group-hover:text-violet-200 transition-colors" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-100 transition-colors">
                                    {f.title}
                                </h3>
                                <p className="text-slate-400 leading-relaxed flex-grow group-hover:text-slate-300 transition-colors">
                                    {f.desc}
                                </p>

                                {/* Hover arrow */}
                                <div className="mt-6 flex items-center text-violet-400 group-hover:text-violet-300 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
                                    <span className="text-sm font-semibold">
                                        Tìm hiểu thêm
                                    </span>
                                    <svg
                                        className="w-4 h-4 ml-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...defaultTransition, delay: 0.4 }}
                className="mt-20 text-center"
            >
                <p className="text-slate-400 mb-6">
                    Khám phá tất cả tính năng của Zenith EDU
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 hover:border-violet-500/40 transition-all hover:bg-gradient-to-r hover:from-violet-600/30 hover:to-purple-600/30 cursor-pointer">
                    <span className="text-sm font-semibold text-violet-300">
                        Xem tất cả tính năng
                    </span>
                    <svg
                        className="w-4 h-4 text-violet-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </div>
            </motion.div>
        </section>
    );
}
