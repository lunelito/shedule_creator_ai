"use client";
import { motion } from "framer-motion";
import React from "react";

type ToggleNavBarProps = {
  children: React.ReactNode;
  showNavBar: boolean;
};

export default function ToggleNavBar({ children, showNavBar }: ToggleNavBarProps) {
  return (
    <motion.div
      animate={{ width: showNavBar ? "50vw" : "15vw" }}
      initial={{ width: "15vw" }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      className="h-screen overflow-hidden flex flex-col"
    >
      {children}
    </motion.div>
  );
}
