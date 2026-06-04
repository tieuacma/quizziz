"use client";

import * as React from "react";
import { motion } from "framer-motion";

export default function StatCard({
  label,
  value,
  icon,
  className,
  valueClassName,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={
        "zenith-card p-5 group " + (className ?? "")
      }
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/15 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative z-10">
        <span className="text-2xl filter drop-shadow-[0_0_12px_rgba(167,139,250,0.35)]">
          {icon}
        </span>
      </div>
      <p
        className={`font-display text-3xl font-extrabold mt-2 tracking-tight relative z-10 ${valueClassName ?? "text-white"}`}
      >
        {value}
      </p>
      <p className="text-slate-400 text-sm mt-0.5 font-medium relative z-10">
        {label}
      </p>
    </motion.div>
  );
}
