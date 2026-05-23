"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "./landing-data";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "./motion";

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="faq"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="text-center mb-12">
        <h2 id="faq-heading" className="text-3xl sm:text-4xl font-bold mb-4">
          Câu hỏi thường gặp
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Giải đáp nhanh những thắc mắc phổ biến về Zenith EDU.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.question}
              className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={cn(
                  "w-full flex items-center justify-between gap-4 px-5 py-4 text-left",
                  "text-white font-medium hover:bg-white/[0.04] transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-inset"
                )}
                aria-expanded={isOpen}
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-violet-400 shrink-0 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.25 }}
                  >
                    <p className="px-5 pb-4 text-slate-400 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
