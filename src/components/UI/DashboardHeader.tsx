import React, { SetStateAction } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import FadeAnimation from "@/animations/FadeAnimation";
import ErrorConatiner from "./ErrorConatiner";

type DashboardHeadertype = {
  onClick?: () => void;
  title: string;
  error?: string;
};

export default function DashboardHeader({
  onClick,
  title,
  error,
}: DashboardHeadertype) {
  return (
    <div className="mb-[10vh] w-full">
      {/* !!!!!!!!FIX THIS */}
      <div className="flex w-[90vw] justify-between items-center p-10 gap-4 h-[10vh] fixed top-0 bg-zinc-900 z-10">
        {onClick && (
          <button
            onClick={onClick}
            className="hover:scale-150 transition-all ease-in-out cursor-pointer"
          >
            <Image
              src={"/Icons/arrowIcon.svg"}
              width={50}
              height={50}
              alt="arrow"
              className="rotate-270 invert"
            />
          </button>
        )}
        <div className="flex justify-between w-full">
          <h1 className="text-[clamp(1rem,6vw,2rem)] font-bold text-white">
            {title}
          </h1>
          <ErrorConatiner error={error} />
        </div>
      </div>
    </div>
  );
}
