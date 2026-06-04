"use client";

import { motion } from "framer-motion";
import { useDashboardMotion } from "./motion";

export type BarChartDatum = {
  label: string;
  value: number;
  displayValue?: string;
};

export default function AnimatedBarChart({
  data,
  className,
  barClassName = "bg-gradient-to-t from-indigo-600 to-violet-500",
  heightClass = "h-40",
}: {
  data: BarChartDatum[];
  className?: string;
  barClassName?: string;
  heightClass?: string;
}) {
  const { barGrowVariants, staggerContainer, staggerItem } = useDashboardMotion();
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={`flex items-end justify-between gap-2 ${heightClass} ${className ?? ""}`}
    >
      {data.map((datum) => {
        const heightPct = Math.max((datum.value / maxValue) * 100, 8);
        return (
          <motion.div
            key={datum.label}
            variants={staggerItem}
            className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
          >
            <span className="text-[10px] text-slate-500">
              {datum.displayValue ?? datum.value}
            </span>
            <motion.div
              custom={heightPct}
              variants={barGrowVariants}
              initial="hidden"
              animate="visible"
              style={{ originY: 1 }}
              className={`w-full max-w-10 rounded-t-lg ${barClassName}`}
            />
            <span className="text-xs text-slate-400 font-medium">{datum.label}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
