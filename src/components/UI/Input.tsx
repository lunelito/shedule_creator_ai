import FadeAnimation from "@/animations/FadeAnimation";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

type InputType = {
  children: React.ReactNode;
  type: "password" | "text" | "number";
  name: string;
  isInvalid: boolean | undefined;
  errorMessage: string[];
  isPending: boolean;
};

export default function Input({
  children,
  type,
  name,
  isInvalid,
  errorMessage,
  isPending,
}: InputType) {

  const [val, setVal] = useState("");

  console.log(isPending)

  return (
    <div
      className={`relative ${
        isInvalid
          ? "text-teal-600" // błąd
          : "text-white" // poprawne
      } font-extrabold p-2 w-[90%]
      ${isPending ? "opacity-75" : ""}`}
    >
      <input
        id={`${children}`}
        name={`${name}`}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        type={type}
        disabled={isPending}
        className={` w-[100%] peer border-b bg-inherit py-1 font-bold transition-colors focus:border-b-2 focus:outline-none `}
      />
      <label
        htmlFor={`${children}`}
        className={`absolute p-2 left-0 cursor-text transition-all select-none peer-focus:-top-5 peer-focus:text-lg w-[90%] ${
          (val || "").length === 0 ? "top-1 text-xl" : "-top-5 text-sm"
        }`}
      >
        {children}
      </label>
      <div className="flex justify-start mt-2 text-sm">
        <AnimatePresence mode="wait">
          {isInvalid ? (
            <FadeAnimation animationKey={"errorMessage"}>
              {errorMessage[0]}
            </FadeAnimation>
          ) : (
            "tekst"
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
