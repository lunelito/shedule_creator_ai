"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useIsVisible } from "@/lib/hooks/useIsVisible";
import SlideFromTopSticky from "@/animations/SlideFromTopSticky";
import { isAtMost, useBreakpoint } from "@/lib/hooks/useBreakPoints";
import Nav from "./Nav";
import Slider from "./Slider";
import { pagesType, sectionsType } from "@/app/page";
import { useRouter } from "next/navigation";

type NavBarType = {
  sections: sectionsType;
  pages: pagesType;
  pageRef: React.RefObject<HTMLDivElement | null>;
};

export default function NavBar({ sections, pageRef, pages }: NavBarType) {
  const navRef = useRef<HTMLDivElement>(null);
  const navVisible = useIsVisible(navRef);
  const bp = useBreakpoint() || "";
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  const isMobile = isAtMost(bp, "sm");
  const isTablet = !isMobile && isAtMost(bp, "lg");
  const isDesktop = !isMobile && !isTablet;

  const showStaticNav = isDesktop;
  const showStickyNav = isMobile || isTablet || !navVisible;

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log({
    bp,
    isMobile,
    isTablet,
    isDesktop,
    navVisible,
    showStickyNav,
    showStaticNav,
  });

  const navigateTo = (url: string) => {
    router.push(url);
  };

  if (!mounted) return <div className="h-[5vh] m-2 w-full" ref={navRef} />;

  return (
    <div className="z-10" ref={pageRef}>
      {showStaticNav && (
        <div ref={navRef}>
          <div className="p-2">
            {!isMobile && (
              <Nav
                sections={sections}
                scrollTo={scrollTo}
                navigateTo={navigateTo}
                pages={pages}
              />
            )}
          </div>
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 z-50 p-2">
        <AnimatePresence>
          {showStickyNav && (
            <SlideFromTopSticky position={1}>
              {isMobile ? (
                <Slider
                  sections={sections}
                  scrollTo={scrollTo}
                  navigateTo={navigateTo}
                  pages={pages}
                />
              ) : (
                <Nav
                  sections={sections}
                  scrollTo={scrollTo}
                  navigateTo={navigateTo}
                  pages={pages}
                />
              )}
            </SlideFromTopSticky>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
