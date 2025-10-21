"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

type RenderNavBarProps = {
  children: React.ReactNode;
  animationKey: string | number;
};

export default function RenderNavBar({
  children,
  animationKey,
}: RenderNavBarProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ x: "-10vh", opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut", type: "tween" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
