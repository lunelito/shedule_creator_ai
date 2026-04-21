"use client";
import Image from "next/image";
import React, { RefObject, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SlideFromTop from "@/animations/SlideFromTop";
import { useIsVisible } from "@/lib/hooks/useIsVisible";
import SlideFromTopSticky from "@/animations/SlideFromTopSticky";

export default function NavBar() {
  const elements = [
    "About us",
    "home",
    "Log in",
    "Blog",
    "more",
    "more",
    "more",
  ];

  const navRef = useRef<HTMLDivElement>(null);
  const navVisible = useIsVisible(navRef);

  const nav = (
    <nav className="w-full h-[5vh] flex justify-between items-center">
      <div className="flex gap-2">
        {elements.map((el, i) => (
          <SlideFromTop key={i} position={i}>
            <div
              className={`m-4 px-4 py-2 text-lg transition ease-in-out hover:-translate-y-1`}
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

  return (
    <div className="z-10">
      <div className="p-2" ref={navRef}>
        {nav}
      </div>
      <div className="fixed top-0 left-0 right-0 z-50 p-2">
        <AnimatePresence>
          {!navVisible && (
            <SlideFromTopSticky position={1}>
              <div className="bg-zinc-900/70 backdrop-blur-sm text-white rounded-xl">
                {nav}
              </div>
            </SlideFromTopSticky>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
