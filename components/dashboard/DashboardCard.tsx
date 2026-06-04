"use client";

import * as React from "react";
import { motion } from "framer-motion";

export default function DashboardCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={"zenith-card " + (className ?? "")}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
