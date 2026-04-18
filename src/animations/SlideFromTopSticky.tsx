"use client";

import { motion } from "framer-motion";
import React from "react";

type SlideFromTopStickyProps = {
  children: React.ReactNode;
  index?: number;
  position: number;
};

export default function SlideFromTopSticky({
  children,
  index,
  position,
}: SlideFromTopStickyProps) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 w-full flex justify-center items-center"
    >
      {children}
    </motion.div>
  );
}
