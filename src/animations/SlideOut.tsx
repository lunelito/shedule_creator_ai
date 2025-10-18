import React from "react";

import { motion } from "framer-motion";

type RenderAnimationProps = {
  children: React.ReactNode;
  animationKey: string | number;
};

export default function SlideOut({
  children,
  animationKey,
}: RenderAnimationProps) {
  return (
    <motion.div
      key={animationKey}
      initial={{
        y: "100vh",
      }}
      animate={{ y: 0 }}
      exit={{
        y: "-100vh",
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
