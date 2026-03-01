import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

type PopUpAnimationType = {
  children: React.ReactNode;
  setActiveModal: Dispatch<SetStateAction<boolean>>;
};

export default function PopUpAnimation({
  children,
  setActiveModal,
}: PopUpAnimationType) {
  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] h-screen w-screen bg-[rgba(0,0,0,0.5)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => setActiveModal(false)}
    >
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl text-white bg-zinc-800 p-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
