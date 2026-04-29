import SlideFromTop from "@/animations/SlideFromTop";
import React from "react";
import Image from "next/image";

type navType = {
  elements: string[];
};

export default function Nav({ elements }: navType) {
  return (
    <nav className="bg-zinc-900/70 backdrop-blur-sm text-white font-bold rounded-xl m-2 w-full flex justify-between items-center px-8 py-4">
      <div className="flex gap-1 xl:gap-2">
        {elements.map((el, i) => (
          <SlideFromTop key={i} position={i}>
            <div
              className={`m-3 px-3 py-1.5 xl:m-4 xl:px-4 xl:py-2 text-xl transition ease-in-out hover:-translate-y-1`}
            >
              {el}
            </div>
          </SlideFromTop>
        ))}
      </div>
      <div className="flex justify-center items-center">
        <SlideFromTop position={elements.length}>
          <Image
            className="mx-8"
            src={"/logo/logo_img.png"}
            width={60}
            height={60}
            alt="logo"
          />
        </SlideFromTop>
      </div>
    </nav>
  );
}
