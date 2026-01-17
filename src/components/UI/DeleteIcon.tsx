import React from "react";
import Image from "next/image";

type DeleteIconType = {
  onClick: () => void;
  path?: string;
  side?: "R" | "L";
  bgColor?: string;
  size: "S" | "M" | "L" | "XL";
};

const sizeMap = {
  S: {
    button: "h-4 w-4",
    top: "-top-2",
    side: "-left-2 -right-2",
  },
  M: {
    button: "h-8 w-8",
    top: "-top-4",
    side: "-left-4 -right-4",
  },
  L: {
    button: "h-12 w-12",
    top: "-top-6",
    side: "-left-6 -right-6",
  },
  XL: {
    button: "h-[18px] w-[18px]",
    top: "-top-8",
    side: "-left-8 -right-8",
  },
};

export default function DeleteIcon({
  onClick,
  path = "/Icons/trashBin.svg",
  side = "L",
  bgColor = "bg-zinc-800",
  size,
}: DeleteIconType) {
  const { button, top, side: sideOffset } = sizeMap[size];
  const [left, right] = sideOffset.split(" ");

  return (
    <div className={`absolute ${top} ${side === "L" ? left : right}`}>
      <button
        onClick={onClick}
        className={`relative ${bgColor} ${button} rounded-full flex items-center justify-center cursor-pointer`}
      >
        <Image
          src={path}
          alt="delete"
          fill
          className="object-contain scale-75"
        />
      </button>
    </div>
  );
}
