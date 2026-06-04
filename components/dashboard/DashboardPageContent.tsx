"use client";

import { motion } from "framer-motion";
import { useDashboardMotion } from "./motion";

export default function DashboardPageContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pageVariants, reduced } = useDashboardMotion();

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={reduced ? "zenith-page-enter" : undefined}
    >
      {children}
    </motion.div>
  );
}
