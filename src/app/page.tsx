"use client";
import SlideFromTopSticky from "@/animations/SlideFromTopSticky";
import LandingPage from "@/components/HomePage/LandingPage";
import NavBar from "@/components/NavBar/landingPage/NavBar";
import { useIsVisible } from "@/lib/hooks/useIsVisible";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

export default function HomePage() {
  // bg bg-zinc-900
  // secondary bg-zinc-800
  const navRef = useRef<HTMLElement>(null);
  const navVisible = useIsVisible(navRef);

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white flex flex-col overflow-auto scrollbar-thin">
      <div className="p-2">
        <NavBar navRef={navRef} />
      </div>
      <AnimatePresence>
        {!navVisible && (
          <SlideFromTopSticky position={1}>
            <div className="bg-zinc-800/60 text-white rounded-xl">
              <NavBar smaller={true} />
            </div>
          </SlideFromTopSticky>
        )}
      </AnimatePresence>
      <LandingPage/>
      <div className="w-full h-[200vh] ">Landing</div>
      <div className="w-full h-[200vh] ">Landing</div>
    </div>
  );
}
