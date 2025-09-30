"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

type ToggleNavBarProps = {
  children: React.ReactNode;
  showNavBar: boolean;
};

export default function ToggleNavBar({
  children,
  showNavBar,
}: ToggleNavBarProps) {
  const [deviceWidth, setDeviceWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setDeviceWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getWidth = () => {
    if (!showNavBar) return "0vw";
    if (deviceWidth < 768) return "40vw";        // mobile
    if (deviceWidth < 1024) return "25vw";       // medium devices (md)
    return "13vw";                                // desktop (lg+)
  };

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: getWidth(), opacity: showNavBar ? 1 : 0 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  );
}
