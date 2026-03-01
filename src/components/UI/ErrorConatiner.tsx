import FadeAnimation from "@/animations/FadeAnimation";
import { AnimatePresence } from "framer-motion";
import React from "react";

type ErrorConatinerType = {
  error?: string;
};

export default function ErrorConatiner({ error }: ErrorConatinerType) {
  return (
    <AnimatePresence mode="wait">
      {error && (
        <FadeAnimation animationKey={`errorMessage-${error || "unknown"}`}>
          <p className="text-[clamp(1rem,6vw,2rem)] font-bold text-teal-600">
            {error}!
          </p>
        </FadeAnimation>
      )}
    </AnimatePresence>
  );
}
