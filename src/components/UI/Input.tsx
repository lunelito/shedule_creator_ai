import FadeAnimation from "@/animations/FadeAnimation";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

type InputType = {
  text: string;
  type: "password" | "text" | "number";
  name: string;
  isInvalid: boolean | undefined;
  errorMessage: string[];
  isPending: boolean;
};

export default function Input({
  text,
  type,
  name,
  isInvalid,
  errorMessage,
  isPending,
}: InputType) {
  const [val, setVal] = useState("");
  const [showAllText, setShowAllText] = useState(false);

  return (
    <div
      className={`relative  p-2 w-full ${
        isInvalid ? "text-teal-600" : "text-white"
      } ${isPending ? "opacity-75" : ""}`}
    >
      <input
        id={text}
        name={name}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        type={type}
        onFocus={() => setShowAllText(true)}
        onBlur={() => setShowAllText(false)}
        disabled={isPending}
        className={`
          w-full peer border-b bg-inherit py-1 font-bold transition-colors focus:border-b-2 focus:outline-none
          text-[clamp(0.875rem,2vw,1.25rem)]
        `}
      />
      <label
        htmlFor={text}
        className={`
          absolute left-0 cursor-text select-none p-2 transition-all w-full
          ${val.length === 0 ? "top-1" : "-top-5"}
          peer-focus:-top-5 peer-focus:text-[clamp(0.75rem,1.8vw,1rem)]
          text-nowrap
        `}
      >
        {showAllText ? text : text.length > 9 ? text.slice(0, 9) + "..." : text}
      </label>
      <div className="flex justify-start mt-2 text-[clamp(0.75rem,1.5vw,0.875rem)]">
        <AnimatePresence mode="wait">
          {isInvalid && (
            <FadeAnimation animationKey={"errorMessage"}>
              {errorMessage[0]}
            </FadeAnimation>
          )}
          <p className="text-transparent">.</p>
        </AnimatePresence>
      </div>
    </div>
  );
}
