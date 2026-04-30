import SlideFromTop from "@/animations/SlideFromTop";
import { pagesType, sectionsType } from "@/app/page";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

type sliderType = {
  sections: sectionsType;
  scrollTo: (ref: React.RefObject<HTMLElement | null>) => void;
  navigateTo: (url: string) => void;
  pages: pagesType;
};

export default function Slider({
  sections,
  scrollTo,
  navigateTo,
  pages,
}: sliderType) {
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
          {showList && (
            <>
              {sections.map((section) => (
                <SlideFromTop key={section.id} position={section.id}>
                  <div
                    onClick={() => scrollTo(section.ref)}
                    className={`m-3 px-3 py-1.5 xl:m-4 xl:px-4 xl:py-2 text-xl transition ease-in-out hover:-translate-y-1`}
                  >
                    {section.name}
                  </div>
                </SlideFromTop>
              ))}
              {pages.map((page) => (
                <SlideFromTop key={page.id} position={page.id}>
                  <div
                    onClick={() => navigateTo(page.url)}
                    className={`m-3 px-3 py-1.5 xl:m-4 xl:px-4 xl:py-2 text-xl transition ease-in-out hover:-translate-y-1`}
                  >
                    {page.name}
                  </div>
                </SlideFromTop>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
