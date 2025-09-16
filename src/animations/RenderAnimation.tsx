"use client";

import { motion } from "framer-motion";
import React from "react";

export default function RenderAnimation({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ y: 150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 8 }}
    >
      {children}
    </motion.div>
  );
}
