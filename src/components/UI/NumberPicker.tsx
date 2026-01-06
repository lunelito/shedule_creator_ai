import Image from "next/image";
import React, { useEffect, useState } from "react";

type NumberPickerType = {
  from: number;
  to: number;
  rangeDefault: number;
  title: string;
  orientation: "vertical" | "horizontal";
  onChange?: (value: number) => void;
  disabled?: boolean;
  expendDisabled?: boolean;
  expendSide?: string;
};

export default function NumberPicker({
  from,
  to,
  rangeDefault,
  title,
  orientation,
  onChange,
  disabled,
  expendDisabled,
  expendSide,
}: NumberPickerType) {
  const [selected, setSelected] = useState(rangeDefault);
  const [animating, setAnimating] = useState(false);

  const getPrev = (num: number) => (num - 1 < from ? to : num - 1);
  const getNext = (num: number) => (num + 1 > to ? from : num + 1);

  const scrollUp = (step: number = 1) => {
    if (disabled || (expendDisabled && expendSide == "L")) return;

    setAnimating(true);
    setSelected((prev) => {
      let newVal = prev - step;
      if (newVal < from) newVal = to - (step - (prev - from));
      return newVal;
    });
    setTimeout(() => setAnimating(false), 100);
  };

  const scrollDown = (step: number = 1) => {
    if (disabled || (expendDisabled && expendSide == "R")) return;

    setAnimating(true);
    setSelected((prev) => {
      let newVal = prev + step;
      if (newVal > to) newVal = from + (step - (to - prev));
      return newVal;
    });
    setTimeout(() => setAnimating(false), 100);
  };

  useEffect(() => {
    onChange && onChange(selected);
  }, [selected]);

  const isHorizontal = orientation === "horizontal";

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="mb-2">{title}</h1>
      <div
        className={`rounded-lg flex items-center justify-center select-none ${
          isHorizontal ? "flex-row w-56 h-24" : "flex-col w-24 h-56"
        }`}
      >
        <button
          disabled={disabled || (expendDisabled && expendSide == "L")}
          onClick={() => scrollUp(1)}
          onDoubleClick={() => scrollUp(2)}
          className={`relative flex invert justify-center items-center rounded ${
            disabled || (expendDisabled && expendSide == "L")
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer"
          } ${isHorizontal ? "h-full w-10 -rotate-90" : "h-10 w-full"}`}
        >
          <Image
            src="/icons/arrowIcon.svg"
            width={40}
            height={40}
            alt="arrow"
          />
        </button>

        <div
          className={`text-gray-500 flex items-center justify-center ${
            isHorizontal ? "w-16 h-full" : "h-16 w-full"
          }`}
        >
          {getPrev(selected)}
        </div>

        <div
          className={`text-teal-600 font-bold text-xl flex items-center justify-center transform transition-all duration-200 ${
            isHorizontal ? "w-16 h-full" : "h-16 w-full"
          } ${animating ? "scale-110 opacity-70" : "scale-125 opacity-100"}`}
        >
          {selected}
        </div>

        <div
          className={`text-gray-500 flex items-center justify-center ${
            isHorizontal ? "w-16 h-full" : "h-16 w-full"
          }`}
        >
          {getNext(selected)}
        </div>

        <button
          disabled={disabled || (expendDisabled && expendSide == "R")}
          onClick={() => scrollDown(1)}
          onDoubleClick={() => scrollDown(2)}
          className={`flex justify-center invert items-center rounded ${
            disabled || (expendDisabled && expendSide == "R")
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer"
          } ${
            isHorizontal ? "h-full w-10 rotate-90" : "h-10 w-full rotate-180"
          }`}
        >
          <Image
            src="/icons/arrowIcon.svg"
            width={40}
            height={40}
            alt="arrow"
          />
        </button>
      </div>
    </div>
  );
}
