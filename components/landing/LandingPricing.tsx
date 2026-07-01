"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "./landing-data";
import { Check, HelpCircle } from "lucide-react";
import {
    defaultTransition,
    fadeUp,
    staggerContainer,
    usePrefersReducedMotion,
} from "./motion";

export default function LandingPricing() {
    const [isAnnual, setIsAnnual] = useState(false);
    const reduced = false;

    const formatPrice = (plan: (typeof PRICING_PLANS)[number]) => {
        const price = isAnnual ? plan.priceAnnually : plan.priceMonthly;
        if (price === 0) return "Miễn phí";
        if (price === -1) return "Liên hệ";
        return `${price.toLocaleString("vi-VN")} ₫`;
    };

    return (
        <section
            id="bang-gia"
            className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 overflow-hidden"
            aria-labelledby="pricing-heading"
        >
            {/* Background decorations */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/2 -right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-3xl" />
                <div className="absolute bottom-0 -left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/5 blur-3xl" />
            </div>

            <div className="relative text-center mb-12">
                <motion.div
                    initial={reduced ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={defaultTransition}
                >
                    <p className="text-sm font-semibold text-violet-300 uppercase tracking-widest mb-4">
                        Bảng Giá Dịch Vụ
                    </p>
                    <h2
                        id="pricing-heading"
                        className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
                    >
                        Lựa chọn gói Đội Ngũ{" "}
                        <span className="zenith-gradient-text block">
                            phù hợp với bạn
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Bắt đầu miễn phí và nâng cấp bất cứ khi nào bạn muốn.
                        Không có phí ẩn, hủy bỏ bất cứ lúc nào.
                    </p>
                </motion.div>
            </div>

            {/* Switcher Toggle */}
            <div className="flex justify-center items-center gap-4 mb-16 sm:mb-20">
                <span
                    className={`text-sm font-bold transition-colors ${!isAnnual ? "text-white" : "text-slate-400"}`}
                >
                    Thanh toán hàng tháng
                </span>
                <button
                    onClick={() => setIsAnnual(!isAnnual)}
                    className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-white/10 hover:bg-white/15 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500/55 focus:ring-offset-2 focus:ring-offset-slate-900"
                    role="switch"
                    aria-checked={isAnnual}
                >
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-gradient-to-br from-violet-400 to-purple-500 shadow-md ring-0 transition duration-200 ease-in-out ${
                            isAnnual
                                ? "translate-x-7 bg-gradient-to-br from-cyan-400 to-violet-500"
                                : "translate-x-0"
                        }`}
                    />
                </button>
                <div className="flex items-center gap-2">
                    <span
                        className={`text-sm font-bold transition-colors ${isAnnual ? "text-white text-neon-glow-cyan" : "text-slate-400"}`}
                    >
                        Thanh toán theo năm
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 border border-emerald-500/35 text-emerald-400">
                        Tiết kiệm 20%
                    </span>
                </div>
            </div>

            {/* Plans list */}
            <motion.div
                className="grid md:grid-cols-3 gap-8 items-stretch"
                variants={reduced ? undefined : staggerContainer}
                initial={reduced ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
            >
                {PRICING_PLANS.map((plan) => (
                    <motion.div
                        key={plan.name}
                        variants={reduced ? undefined : fadeUp}
                        transition={defaultTransition}
                        className={`relative flex flex-col h-full rounded-2xl group ${
                            plan.popular ? "z-10" : ""
                        }`}
                    >
                        {/* Poplular Plan glowing/gradient borders */}
                        {plan.popular && (
                            <div className="absolute inset-0 -m-[2px] rounded-[18px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 -z-10 blur-[1px] opacity-100 group-hover:blur-[2px] transition-all duration-300" />
                        )}

                        <Card
                            className={`h-full flex flex-col justify-between rounded-2xl border bg-white/[0.03] group transition-all duration-300 flex-1 ${
                                plan.popular
                                    ? "bg-[#0b0a1a]/95 border-transparent shadow-2xl shadow-violet-950/50"
                                    : "border-white/10 hover:border-white/15"
                            }`}
                        >
                            <CardContent className="p-8 flex flex-col justify-between h-full relative z-10">
                                <div>
                                    {/* Badge */}
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-white tracking-tight">
                                            {plan.name}
                                        </h3>
                                        {plan.popular && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-700/25 animate-pulse">
                                                ⭐ Phổ biến nhất
                                            </span>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="mb-6 flex items-baseline gap-1">
                                        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                                            {formatPrice(plan)}
                                        </span>
                                        {plan.priceMonthly > 0 && (
                                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                                /tháng
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                        {plan.description}
                                    </p>

                                    {/* Divider */}
                                    <div className="h-[1px] bg-white/5 mb-8" />

                                    {/* Features */}
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feat) => (
                                            <li
                                                key={feat}
                                                className="flex items-start gap-3"
                                            >
                                                <div
                                                    className={`mt-0.5 rounded-full p-0.5 flex items-center justify-center shrink-0 ${
                                                        plan.popular
                                                            ? "bg-violet-500/20 text-violet-300"
                                                            : "bg-white/5 text-slate-400"
                                                    }`}
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
                                                    {feat}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action button */}
                                <div className="mt-auto">
                                    <Button
                                        onClick={() =>
                                            (window.location.href = plan.popular
                                                ? "/signup?plan=pro"
                                                : "/signup")
                                        }
                                        className={`w-full py-6 rounded-xl font-bold transition-all text-sm tracking-wide shrink-0 ${
                                            plan.popular
                                                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-600/35 hover:shadow-violet-600/50 cursor-pointer"
                                                : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 cursor-pointer"
                                        }`}
                                    >
                                        {plan.ctaText}
                                    </Button>
                                    {plan.priceMonthly > 99000 && (
                                        <p className="text-[10px] text-center text-slate-500 mt-3 flex items-center justify-center gap-1">
                                            <HelpCircle className="w-3 h-3" />{" "}
                                            Hợp đồng & hóa đơn VAT đầy đủ
                                        </p>
                                    )}
                                    {plan.priceMonthly === 99000 &&
                                        isAnnual && (
                                            <p className="text-[10px] text-center text-violet-300 font-medium mt-3">
                                                * Trả trước theo năm:{" "}
                                                {(
                                                    plan.priceAnnually * 12
                                                ).toLocaleString("vi-VN")}{" "}
                                                ₫ / năm
                                            </p>
                                        )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
