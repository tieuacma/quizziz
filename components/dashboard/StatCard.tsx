"use client";

import * as React from 'react';
import { motion } from 'framer-motion';

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
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={
        "rounded-2xl border border-white/8 bg-white/[0.04] p-5 hover:bg-white/[0.07] hover:border-indigo-500/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)] relative overflow-hidden group " +
        (className ?? '')
      }
    >
      {/* Decorative Glow on hover */}
      <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="flex items-start justify-between gap-3 relative z-10">
        <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">{icon}</span>
      </div>
      <p className={`text-3xl font-bold mt-2 tracking-tight relative z-10 ${valueClassName ?? 'text-white'}`}>
        {value}
      </p>
      <p className="text-slate-400 text-sm mt-0.5 font-medium relative z-10">{label}</p>
    </motion.div>
  );
}
