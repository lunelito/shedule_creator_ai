"use client";

import { motion } from "framer-motion";
import React from "react";

type SlideFromTopProps = {
  children: React.ReactNode;
  index?: number;
  position: number;
  total?: number;
};

export default function SlideFromTop({
  children,
  index,
  position,
  total = 0,
}: SlideFromTopProps) {
  return (
    <motion.div
      key={index}
      initial={{ y: -30, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: {
          delay: 0.1 * position,
          duration: 0.4,
          ease: "easeInOut",
          type: "spring",
        },
      }}
      exit={{
        y: -30,
        opacity: 0,
        transition: {
          delay: 0.1 * (total - position),
          duration: 0.4,
          ease: "easeInOut",
          type: "spring",
        },
      }}
    >
      {children}
    </motion.div>
  );
}
