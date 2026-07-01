"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_ITEMS } from "./landing-data";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion, defaultTransition } from "./motion";

export default function LandingFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const reduced = false;

    return (
        <section
            id="faq"
            className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 overflow-hidden"
            aria-labelledby="faq-heading"
        >
            {/* Background elements */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-1/2 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-violet-600/10 via-transparent to-transparent blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-tl from-cyan-600/10 via-transparent to-transparent blur-3xl" />
            </div>

            <div className="relative text-center mb-12 sm:mb-16">
                <motion.div
                    initial={reduced ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={defaultTransition}
                >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-500/20 ring-1 ring-violet-500/20 mb-4 mx-auto">
                        <HelpCircle className="w-6 h-6 text-violet-300" />
                    </div>
                    <p className="text-sm font-semibold text-violet-300 uppercase tracking-widest mb-4">
                        Câu Hỏi Thường Gặp
                    </p>
                    <h2
                        id="faq-heading"
                        className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
                    >
                        Những câu hỏi{" "}
                        <span className="zenith-gradient-text block">
                            bạn quan tâm
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Tìm hiểu thêm về Zenith EDU và cách nó giúp giáo viên và
                        học sinh.
                    </p>
                </motion.div>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
                {FAQ_ITEMS.map((item, index) => {
                    const isOpen = openIndex === index;
                    const buttonId = `faq-button-${index}`;
                    const panelId = `faq-panel-${index}`;

                    return (
                        <motion.div
                            key={item.question}
                            initial={reduced ? false : { opacity: 0, y: 20 }}
                            whileInView={
                                reduced ? undefined : { opacity: 1, y: 0 }
                            }
                            viewport={{ once: true, margin: "-60px" }}
                            transition={defaultTransition}
                            className="group"
                        >
                            <div
                                className={cn(
                                    "rounded-2xl border transition-all duration-300 overflow-hidden",
                                    "bg-white/[0.02] hover:bg-white/[0.06]",
                                    isOpen
                                        ? "border-violet-500/30 bg-white/[0.08] shadow-lg shadow-violet-600/10"
                                        : "border-white/10 group-hover:border-violet-500/20"
                                )}
                            >
                                <button
                                    id={buttonId}
                                    type="button"
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : index)
                                    }
                                    className={cn(
                                        "w-full flex items-center justify-between gap-4 px-6 py-5 text-left",
                                        "text-white font-semibold hover:text-violet-200 transition-colors",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-inset"
                                    )}
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                >
                                    <span className="flex-grow">
                                        {item.question}
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            "w-5 h-5 text-violet-400 shrink-0 transition-transform duration-300",
                                            isOpen && "rotate-180"
                                        )}
                                    />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={panelId}
                                            role="region"
                                            aria-labelledby={buttonId}
                                            initial={
                                                reduced
                                                    ? false
                                                    : { height: 0, opacity: 0 }
                                            }
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={
                                                reduced
                                                    ? undefined
                                                    : { height: 0, opacity: 0 }
                                            }
                                            transition={{
                                                duration: reduced ? 0 : 0.3,
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-5 border-t border-white/10 pt-5">
                                                <p className="text-slate-300 leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Contact CTA */}
            <motion.div
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...defaultTransition, delay: 0.4 }}
                className="mt-16 pt-12 border-t border-white/10 text-center"
            >
                <p className="text-slate-400 mb-6">
                    Không tìm thấy câu trả lời?
                </p>
                <a
                    href="mailto:support@zenith.edu"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-violet-600/40 hover:shadow-violet-600/60 transition-all transform hover:scale-105"
                >
                    Liên hệ với chúng tôi
                    <svg
                        className="w-4 h-4"
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
                </a>
            </motion.div>
        </section>
    );
}
