"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboardMotion } from "./motion";

export default function PageHero({
  title,
  description,
  icon: Icon,
  actions,
}: {
  title: ReactNode;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}) {
  const { heroVariants } = useDashboardMotion();

  return (
    <motion.div
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          {Icon && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Icon className="w-7 h-7 text-primary shrink-0" />
            </motion.span>
          )}
          <span className="zenith-gradient-text-static">{title}</span>
        </h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="text-slate-400 text-sm mt-1"
          >
            {description}
          </motion.p>
        )}
      </div>
      {actions && (
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="flex flex-wrap gap-2"
        >
          {actions}
        </motion.div>
      )}
    </motion.div>
  );
}
