"use client";
import React, { useState, useEffect } from "react";
import FadeAnimation from "@/animations/FadeAnimation";
import { AnimatePresence } from "framer-motion";

type FileInputProps = {
  text: string;
  name: string;
  isPending?: boolean;
  isInvalid?: boolean;
  errorMessage?: string[];
  onFileChange?: (file: File | null) => void;
};

export default function FileInput({
  text,
  name,
  isPending,
  onFileChange,
  errorMessage = [],
  isInvalid = false,
}: FileInputProps) {
  const [fileName, setFileName] = useState("");
  const [showAllText, setShowAllText] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : "");
    if (onFileChange) onFileChange(file);
  };

  return (
    <div
      className={`relative w-full p-2 ${
        isInvalid ? "text-teal-600" : "text-white"
      } ${isPending ? "opacity-75" : ""}`}
    >
      {/* Ukryty input */}
      <input
        type="file"
        id={name}
        name={name}
        accept="image/*"
        className="absolute w-full h-full opacity-0 cursor-pointer -z-10"
        onChange={handleChange}
        disabled={isPending}
        onFocus={() => setShowAllText(true)}
        onBlur={() => setShowAllText(false)}
      />
      <label
        htmlFor={name}
        className={`block w-full border-b bg-inherit py-1 font-bold transition-all 
          focus:border-b-2 focus:outline-none cursor-pointer
          text-[clamp(0.875rem,2vw,1.25rem)]
          overflow-hidden whitespace-nowrap`}
      >
        {isMobile
          ? showAllText
            ? fileName || <span className="font-normal">{text}</span>
            : fileName.length > 9
            ? fileName.slice(0, 9) + "..."
            : fileName || <span className="font-normal">{text}</span>
          : fileName || <span className="font-normal">{text}</span>}
      </label>
      <div className="flex justify-start mt-2 text-[clamp(0.75rem,1.5vw,0.875rem)]">
        <AnimatePresence mode="wait">
          {isInvalid && errorMessage[0] && (
            <FadeAnimation animationKey={`errorMessage-${errorMessage[0]}`}>
              {errorMessage[0]}
            </FadeAnimation>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
