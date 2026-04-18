"use client";
import Image from "next/image";
import React, { RefObject, useRef } from "react";
import { motion } from "framer-motion";
import SlideFromTop from "@/animations/SlideFromTop";

type NavBarProps = {
  navRef?: RefObject<HTMLElement | null>;
  smaller?: boolean;
};

export default function NavBar({ navRef, smaller }: NavBarProps) {
  const elements = [
    "About us",
    "home",
    "Log in",
    "Blog",
    "more",
    "more",
    "more",
  ];
  return (
    <nav className="w-full h-[5vh] flex justify-between items-center" ref={navRef}>
      <div className="flex gap-2">
        {elements.map((el, i) => (
          <SlideFromTop key={i} position={i}>
            <div
              className={`${smaller ? "m-2 px-4 py-2 text-sm" : "m-4 px-4 py-2 text-lg"} transition ease-in-out hover:-translate-y-1`}
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
            width={smaller ? 30 : 50}
            height={smaller ? 30 : 50}
            alt="logo"
          />
        </SlideFromTop>
      </div>
    </nav>
  );
}
