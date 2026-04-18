"use client";

import { motion } from "framer-motion";
import React from "react";

type SlideFromTopProps = {
  children: React.ReactNode;
  index?: number;
  position: number;
};

export default function SlideFromTop({
  children,
  index,
  position,
}: SlideFromTopProps) {
  return (
    <motion.div
      key={index}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
        type: "spring",
        delay: 0.10 * position,
      }}
    >
      {children}
    </motion.div>
  );
}
