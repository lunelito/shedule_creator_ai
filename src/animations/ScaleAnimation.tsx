import { motion } from "framer-motion";

type ScaleAnimation = {
  children: React.ReactNode;
  animationKey: string;
  position?:number;
  scale:number
  onAnimationEnd?: () => void;
};

export default function ScaleAnimation({
  children,
  animationKey,
  position = 0,
  scale,
  onAnimationEnd
}: ScaleAnimation) {
  return (
    <motion.div
      key={animationKey}
      onAnimationEnd={onAnimationEnd}
      initial={{ opacity: 0, scale: scale }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
        type: "tween",
        delay: 0.10 * position,
      }}
    >
      {children}
    </motion.div>
  );
}
