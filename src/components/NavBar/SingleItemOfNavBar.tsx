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
  pickedSheduleComponent: number;
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
      className={`flex items-center  justify-between transition ease-in-out p-2 duration-600  cursor-pointer rounded-2xl ${
        pickedSheduleComponent == i ? "bg-teal-600" : "bg-transparent"
      }`}
    >
      <div
        onClick={() => {
          if (toggleMenu && setShowNavbar) setShowNavbar(!showNavBar);
        }}
        className="h-9 w-9 shrink-0 flex justify-center m-1"
      >
        <img
          src={`/icons/${el.icon}.svg`}
          alt={el.icon}
          // w-[9vw] sm:w-[6vw] lg:w-[3vw]
        />
      </div>
      <div className="overflow-hidden">
        <AnimatePresence>
          {showNavBar && (
            <ToggleNavBar showNavBar={showNavBar}>
              <p className="whitespace-nowrap pl-3 overflow-hidden text-white text-[clamp(0.9rem,1.2vw,1.5rem)]">
                {toggleMenu ? "Shedule creator" : el.text}
              </p>
            </ToggleNavBar>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
