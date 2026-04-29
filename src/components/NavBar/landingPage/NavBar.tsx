"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useIsVisible } from "@/lib/hooks/useIsVisible";
import SlideFromTopSticky from "@/animations/SlideFromTopSticky";
import { isAtMost, useBreakpoint } from "@/lib/hooks/useBreakPoints";
import Nav from "./Nav";
import Slider from "./Slider";

export default function NavBar() {
  const navRef = useRef<HTMLDivElement>(null);
  const navVisible = useIsVisible(navRef);
  const bp = useBreakpoint() || "";
  const [mounted, setMounted] = useState(false);

  const isMobile = isAtMost(bp, "sm");
  const isTablet = !isMobile && isAtMost(bp, "lg");
  const isDesktop = !isMobile && !isTablet;

  const showStaticNav = isDesktop;
  const showStickyNav = isMobile || isTablet || !navVisible;

  useEffect(() => {
    setMounted(true);
  }, []);

  const elements = [
    "About us",
    "home",
    "Log in",
    "Blog",
    "more",
    "more",
    "more",
  ];

  if (!mounted) return <div className="h-[5vh] m-2 w-full" />;

  return (
    <div className="z-10">
      {showStaticNav && (
        <div ref={navRef}>
          <div className="p-2">{!isMobile && <Nav elements={elements} />}</div>
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 z-50 p-2">
        <AnimatePresence>
          {showStickyNav && (
            <SlideFromTopSticky position={1}>
              {isMobile ? (
                <Slider elements={elements} />
              ) : (
                <Nav elements={elements} />
              )}
            </SlideFromTopSticky>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
