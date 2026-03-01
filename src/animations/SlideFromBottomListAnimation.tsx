import { motion } from "framer-motion";

type SlideFromBottomListAnimationType = {
  children: React.ReactNode;
  userId: number;
};

export default function SlideFromBottomListAnimation({
  children,
  userId,
}: SlideFromBottomListAnimationType) {
  return (
    <motion.div
      key={userId}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  );
}
