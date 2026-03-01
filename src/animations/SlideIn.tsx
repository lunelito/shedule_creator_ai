import React from "react";

import { motion } from "framer-motion";

type RenderAnimationProps = {
  children: React.ReactNode;
  animationKey: string | number;
};

export default function SlideIn({
  children,
  animationKey,
}: RenderAnimationProps) {
  return (
    <motion.div
      key={animationKey}
      initial={{ y: "-30vh", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{
        y: "30vh",
        opacity: 0,
        transition: {
          duration: 0.7,
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
  );
}
