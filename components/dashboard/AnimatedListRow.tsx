"use client";

import { motion } from "framer-motion";
import { useDashboardMotion } from "./motion";

export default function AnimatedListRow({
  children,
  index = 0,
  className,
  bordered = true,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  bordered?: boolean;
}) {
  const { listRowVariants } = useDashboardMotion();

  return (
    <motion.div
      variants={listRowVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.04 }}
      whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
      className={`transition-colors ${bordered ? "" : ""} ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
