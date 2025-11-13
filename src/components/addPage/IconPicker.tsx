import React, { Dispatch, SetStateAction } from "react";
import useFetch from "@/db/hooks/useFetch";
import FadeAnimation from "@/animations/FadeAnimation";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";

type TypeIconPicker = {
  icon?: string;
  setIcon: Dispatch<SetStateAction<string>>;
  isInvalid: boolean | undefined;
  text: string;
  errorMessage: string[];
  name: string;
  isPending: boolean;
};

export default function IconPicker({
  icon,
  text,
  setIcon,
  isInvalid,
  errorMessage,
  name,
  isPending,
}: TypeIconPicker) {
  const { data, isPending: isIconsPending } = useFetch<string[]>("/api/icons");

  return (
    <div
      className={`p-2 w-full flex flex-col gap-5 ${
        isInvalid ? "text-teal-600" : "text-white"
      } ${isPending ? "opacity-75" : ""}`}
    >
      <div className="w-full  mb-2">
        <p>{text}</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2.5">
        {isIconsPending
          ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-full aspect-square bg-zinc-800 rounded-md animate-pulse"
              />
            ))
          : data?.map((el) => (
              <div key={el} className="relative w-full aspect-square">
                <Image
                  src={`/IconsForOrganization/${el}`}
                  alt={el}
                  fill
                  className={`object-contain transition-transform duration-200 ease-in-out 
                    ${el !== icon ? "hover:scale-105" : ""} 
                    ${el === icon ? "scale-[1.4]" : ""}`}
                  onClick={() => setIcon(el)}
                />
              </div>
            ))}
      </div>

      <input type="hidden" name={name} value={icon} />

      <div className="flex justify-start mt-2 w-full text-[clamp(0.75rem,1.5vw,0.875rem)]">
        <AnimatePresence mode="wait">
          {isInvalid && (
            <FadeAnimation
              animationKey={`errorMessage-${errorMessage?.[0] || "unknown"}`}
            >
              {errorMessage?.[0]}
            </FadeAnimation>
          )}
        </AnimatePresence>
        <p className="text-transparent">.</p>
      </div>
    </div>
  );
}
