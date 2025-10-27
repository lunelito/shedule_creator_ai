import Link from "next/link";
import React from "react";
import { linksType } from "@/app/manage/layout";
import ToggleNavBar from "@/animations/ToggleNavBar";
import { AnimatePresence } from "framer-motion";

type SingleStaticItemProps = linksType & {
  toggleMenu?: boolean;
  showNavBar?: boolean;
  pickedSheduleComponent: number;
  setPickedSheduleComponent: (val: number) => void;
  setShowNavbar?: (val: boolean) => void;
};

export default function SingleStaticItem({
  href,
  icon,
  label,
  id,
  toggleMenu = true,
  showNavBar,
  pickedSheduleComponent,
  setPickedSheduleComponent,
  setShowNavbar,
}: SingleStaticItemProps)
{
  return (
    <Link
      key={id}
      href={href}
      className={`flex items-center justify-between transition ease-in-out p-2 duration-600 cursor-pointer rounded-2xl ${
        pickedSheduleComponent === id ? "bg-teal-600" : "bg-transparent"
      }`}
      onClick={() => {
        if (toggleMenu && setShowNavbar) setShowNavbar(!showNavBar);
        setPickedSheduleComponent(id);
      }}
    >
      <div className="h-9 w-9 shrink-0 flex justify-center m-1">
        <img src={`/icons/${icon}.svg`} alt={icon} />
      </div>

      <div className="overflow-hidden">
        <AnimatePresence>
          {showNavBar && (
            <ToggleNavBar showNavBar={showNavBar}>
              <p className="whitespace-nowrap pl-3 overflow-hidden text-white text-[clamp(0.9rem,1.2vw,1.5rem)]">
                {label}
              </p>
            </ToggleNavBar>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
}
