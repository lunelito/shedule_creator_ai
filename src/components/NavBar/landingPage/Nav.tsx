import SlideFromTop from "@/animations/SlideFromTop";
import React from "react";
import Image from "next/image";
import { pagesType, sectionsType } from "@/app/page";

type navType = {
  sections: sectionsType;
  scrollTo: (ref: React.RefObject<HTMLElement | null>) => void;
  navigateTo: (url: string) => void;
  pages: pagesType;
};

export default function Nav({
  sections,
  scrollTo,
  navigateTo,
  pages,
}: navType) {
  return (
    <nav className="h-[5vh] bg-zinc-900/70 backdrop-blur-sm text-white font-bold rounded-xl m-2 w-fit flex justify-between items-center">
      <div className="flex gap-1 xl:gap-2">
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
      </div>
      <div className="flex justify-center items-center">
        <SlideFromTop position={sections.length}>
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
