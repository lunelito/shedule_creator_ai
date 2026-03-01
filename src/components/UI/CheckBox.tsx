import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import FadeAnimation from "@/animations/FadeAnimation";

type CheckBoxProps = {
  text: string;
  name: string;
  checked?: boolean;
  onChange?: (val: boolean) => void;
  isPending?: boolean;
};

function CheckBox({
  text,
  name,
  checked = false,
  onChange,
  isPending,
}: CheckBoxProps) {
  const [isChecked, setIsChecked] = useState(checked);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggle = () => {
    if (isPending) return;
    setIsChecked(!isChecked);
    onChange && onChange(!isChecked);
  };

  return (
    <div
      className={`text-zinc-800 rounded-xl relative p-3 flex items-center gap-2 w-full justify-between cursor-pointer ${
        isPending ? "opacity-75 pointer-events-none" : ""
      }`}
      onClick={handleToggle}
    >
      <div
        className={`w-6 h-6 flex items-center justify-center border-2 rounded-md transition-all duration-200 ${
          isChecked
            ? "bg-teal-600 border-teal-600"
            : "border-teal-600 bg-transparent"
        }`}
      >
        {isChecked && <div className="w-3 h-3 bg-white rounded-sm" />}
      </div>

      <label className="select-none text-[clamp(0.875rem,2vw,1.25rem)]">
        {isMobile && text.length > 15 ? text.slice(0, 15) + "..." : text}
      </label>
    </div>
  );
}

export default React.memo(CheckBox);
