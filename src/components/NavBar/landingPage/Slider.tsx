import SlideFromTop from "@/animations/SlideFromTop";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

type sliderType = {
  elements: string[];
};

export default function Slider({ elements }: sliderType) {
  const [showList, setShowList] = useState<boolean>(false);
  return (
    <nav className="m-2 w-[90vw]">
      <div className="px-8 py-4 flex justify-between items-center bg-zinc-900/70 backdrop-blur-sm text-white rounded-xl mb-2">
        <SlideFromTop position={1}>
          <Image
            src={"/Icons/menu.svg"}
            width={40}
            height={40}
            alt="logo"
            onClick={() => setShowList(!showList)}
          />
        </SlideFromTop>
        <SlideFromTop position={2}>
          <Image src={"/logo/logo_img.png"} width={50} height={50} alt="logo" />
        </SlideFromTop>
      </div>
      <div className="flex gap-2 flex-col">
        <AnimatePresence>
          {showList &&
            elements.map((el, i) => (
              <SlideFromTop key={i} position={i} total={elements.length}>
                <div
                  className={`px-8 py-4 flex font-bold bg-zinc-900/70 backdrop-blur-sm text-white rounded-xl justify-center items-center`}
                >
                  <p className="text-2xl">{el}</p>
                </div>
              </SlideFromTop>
            ))}
        </AnimatePresence>
      </div>
    </nav>
  );
}
