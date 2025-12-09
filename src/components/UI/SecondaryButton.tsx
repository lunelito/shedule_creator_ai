import React from "react";
import Image from "next/image";

type SecondaryButtonType = {
  onClick: () => void;
  tailwindPropsImage?: string;
  src: string;
  type?: "button" | "submit" | "reset" | undefined;
};

export default function SecondaryButton({
  onClick,
  src,
  type = "button",
  tailwindPropsImage,
}: SecondaryButtonType) {
  return (
    <button
      onClick={onClick}
      type={type}
      className="flex justify-center items-center w-10 h-10 bg-teal-600 text-white text-sm rounded hover:scale-105 transition-all ease-in-out"
    >
      <div
        className={`relative w-10 h-10 invert transition-all ${tailwindPropsImage}`}
      >
        <Image src={src} alt="arrow" fill />
      </div>
    </button>
  );
}
