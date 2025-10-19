import { motion } from "framer-motion";

type FadeAnimationType = {
  children: React.ReactNode;
  animationKey: string;
};

export default function FadeAnimation({
  children,
  animationKey,
}: FadeAnimationType) {
  return (
    <motion.div
      key={animationKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        type: "tween",
      }}
    >
      {children}
    </motion.div>
  );
}
