"use client";

import { motion } from "framer-motion";
import { useDashboardMotion } from "./motion";

export default function StaggerGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { staggerContainer } = useDashboardMotion();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { staggerItem, cardHover } = useDashboardMotion();

  return (
    <motion.div
      variants={staggerItem}
      whileHover={cardHover}
      className={className}
    >
      {children}
    </motion.div>
  );
}
