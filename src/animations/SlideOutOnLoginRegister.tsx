import React from "react";

import { motion } from "framer-motion";

type RenderAnimationProps = {
  children: React.ReactNode;
  animationKey: string | number;
  when?: boolean;
};

export default function SlideOutOnLoginRegister({
  children,
  animationKey,
  when,
}: RenderAnimationProps) {
  return (
    <motion.div
      key={animationKey}
      initial={{ x: 0, opacity: 0 }}
      animate={when ? { y: "-30vh", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={
        when
          ? { duration: 0.7, ease: "easeInOut", type: "tween" }
          : { type: "tween", ease: "easeInOut", duration: 0 }
      }
    >
      {children}
    </motion.div>
  );
}
