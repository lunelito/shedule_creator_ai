"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

type RenderAnimationProps = {
  children: React.ReactNode;
  animationKey: string | number;
};

export default function RenderAnimation({
  children,
  animationKey,
}: RenderAnimationProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{
          y: 200,
          opacity: 0,
          transition: {
            duration: 0.3,
            ease: "easeInOut",
            type: "tween",
          },
        }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 8,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
