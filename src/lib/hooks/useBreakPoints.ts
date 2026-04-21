import { useState, useEffect } from "react";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const BREAKPOINTS: { name: Breakpoint; min: number }[] = [
  { name: "2xl", min: 1536 },
  { name: "xl", min: 1280 },
  { name: "lg", min: 1024 },
  { name: "md", min: 768 },
  { name: "sm", min: 640 },
  { name: "xs", min: 0 },
];

const ORDER: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "2xl"];

export const getBreakpoint = (width: number): Breakpoint => {
  return BREAKPOINTS.find(({ min }) => width >= min)!.name;
};

export const isAtLeast = (current: Breakpoint, target: Breakpoint): boolean => {
  return ORDER.indexOf(current) >= ORDER.indexOf(target);
};

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === "undefined") return "xs";
    return getBreakpoint(window.innerWidth);
  });

  useEffect(() => {
    const handler = () => setBreakpoint(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return breakpoint;
};
