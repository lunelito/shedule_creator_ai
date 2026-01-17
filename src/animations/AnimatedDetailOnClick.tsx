//framer motion
import { motion } from "framer-motion";
import { SetStateAction } from "react";

type AnimatedDetailOnClickType = {
  children: React.ReactNode;
  setActiveModal: React.Dispatch<SetStateAction<boolean>>;
  modalKey: string;
};

export default function AnimatedDetailOnClick({
  children,
  setActiveModal,
  modalKey,
}: AnimatedDetailOnClickType) {
  return (
    <motion.div
      key={modalKey}
      className={`fixed top-0 left-0 z-[100] h-screen w-screen bg-[rgba(0,0,0,0.5)]`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-zinc-800 p-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
