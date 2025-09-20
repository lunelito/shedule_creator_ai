"use client";
import ToggleNavBar from "@/animations/ToggleNavBar";
import React, { useState } from "react";
import { scheduleType } from "@/app/page";
import PopUpAnimation from "@/animations/PopUpAnimation";
import { AnimatePresence } from "framer-motion";

type NavBarProps = {
  schedules: scheduleType[];
};

export default function NavBar({ schedules }: NavBarProps) {
  const [showCreateShedule, SetShowCreateShedule] = useState<boolean>(false);

  return (
    <div className="h-screen flex relative bg-zinc-800">
      {/* Sidebar for large screens */}
      <div className=" flex w-[15vw] flex-col p-5 justify-between">
        <div>
          <h1 className="text-white text-[clamp(0.9rem,1vw,2rem)] hidden lg:block">
            Schedule Creator
          </h1>
          <h1 className="text-white lg:hidden flex sm:justify-center lg:justify-start">
            {/* logo if done on SM device */}
            SC
          </h1>
          <div className="mt-5 flex flex-col gap-5">
            <div className="flex gap-5 items-center text-sm hover:scale-105 transition ease-in-out sm:justify-center lg:justify-start">
              <img
                src={`/icons/menu.svg`}
                alt={"menu"}
                className="h-7 sm:scale-75 scale-140"
              />
              <p className="text-white hidden lg:block text-[clamp(0.6rem,1vw,1rem)]">
                Dashboard
              </p>
            </div>

            <div
              onClick={() => SetShowCreateShedule(true)}
              className="flex gap-5 items-center text-sm hover:scale-105 transition ease-in-out sm:justify-center lg:justify-start"
            >
              <img
                src={`/icons/addIcon.svg`}
                alt="addIcon"
                className="h-7 sm:scale-75 scale-140"
              />
              <p className="text-white hidden lg:block text-[clamp(0.6rem,1vw,1rem)]">
                New Shedule
              </p>
            </div>
            <AnimatePresence>
              {showCreateShedule && (
                <PopUpAnimation setActiveModal={SetShowCreateShedule}>
                  tu bedzie formularz dodawania shedule
                </PopUpAnimation>
              )}
            </AnimatePresence>
            {schedules.map((el, i) => (
              <div
                className="flex gap-5 items-center text-sm hover:scale-105 transition ease-in-out sm:justify-center lg:justify-start"
                key={i}
              >
                <img
                  src={`/icons/${el.icon}.svg`}
                  alt={el.icon}
                  className="h-7 sm:scale-75 scale-140"
                />
                <p className="text-white hidden lg:block text-[clamp(0.6rem,1vw,1rem)]">
                  {el.text}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-5 items-center text-sm hover:scale-105 transition ease-in-out text-white">
          <img
            src="/icons/accountIcon.svg"
            alt="account"
            className="h-7 sm:scale-75 scale-140"
          />
          <p className="text-white hidden xl:block text-[clamp(0.3rem,0.7vw,1rem)]">
            przykladowy@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
