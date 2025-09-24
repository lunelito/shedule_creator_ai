"use client";
import React from "react";
import { AnimatePresence } from "framer-motion";
import ToggleNavBar from "@/animations/ToggleNavBar";
import { scheduleType } from "@/app/page";

type SingleItemOfNavBarProps = {
  el: scheduleType;
  i: number;
  toggleMenu?: boolean;
  setPickedSheduleComponent?: (i: number) => void;
  showNavBar?: boolean;
  pickedSheduleComponent:number;
  setShowNavbar?: (val: boolean) => void;
};

export default function SingleItemOfNavBar({
  el,
  i,
  toggleMenu = true,
  setPickedSheduleComponent,
  showNavBar,
  pickedSheduleComponent,
  setShowNavbar,
}: SingleItemOfNavBarProps) {
  return (
    <div
      key={i}
      onClick={() => {
        setPickedSheduleComponent?.(i);
      }}
      className={`flex items-center gap-3 transition ease-in-out p-2 cursor-pointer rounded-2xl ${pickedSheduleComponent == i ? "bg-teal-600" : ""}`}
    >
      <img
        src={`/icons/${el.icon}.svg`}
        alt={el.icon}
        onClick={() =>{
            if (toggleMenu && setShowNavbar) setShowNavbar(!showNavBar);
        }}
        className="h-7 w-[9vw] sm:w-[6vw] lg:w-[3vw] "
      />

      <AnimatePresence>
        {showNavBar && (
          <ToggleNavBar showNavBar={showNavBar}>
            <p className="whitespace-nowrap overflow-hidden text-white text-[clamp(0.9rem,1.2vw,1.5rem)]">
              {toggleMenu ? "Shedule creator" : el.text }
            </p>
          </ToggleNavBar>
        )}
      </AnimatePresence>
    </div>
  );
}
