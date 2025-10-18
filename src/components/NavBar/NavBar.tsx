"use client";
import { Dispatch, SetStateAction, useState } from "react";
import React from "react";
import { scheduleType } from "@/app/page";
import SingleItemOfNavBar from "./SingleItemOfNavBar";

type NavBarProps = {
  schedules: scheduleType[];
  setPickedSheduleComponent: Dispatch<SetStateAction<number>>;
  pickedSheduleComponent: number;
};

export default function NavBar({
  schedules,
  setPickedSheduleComponent,
  pickedSheduleComponent,
}: NavBarProps) {
  const [showNavBar, setShowNavbar] = useState(false);

  return (
    <div
      className=" bg-zinc-800 h-screen flex relative  w-fit"
      onMouseEnter={() => setShowNavbar(true)}
      onMouseLeave={() => setShowNavbar(false)}
    >
      <div className="flex flex-col justify-between">
        <div className=" w-fit flex  flex-col p-5 justify-between">
          <div className="w-fit  mt-5 flex flex-col gap-5 overflow-y-scroll overflow-x-hidden h-[80vh] scrollbar-none">
            {/* menu */}
            {schedules
              .filter((el, i) => el.id === 0)
              .map((el, i) => (
                <SingleItemOfNavBar
                  key={el.id}
                  el={el}
                  i={el.id}
                  toggleMenu={true}
                  pickedSheduleComponent={pickedSheduleComponent}
                  setPickedSheduleComponent={setPickedSheduleComponent}
                  showNavBar={showNavBar}
                  setShowNavbar={setShowNavbar}
                />
              ))}
            {/* add schedule */}
            {schedules
              .filter((el, i) => el.id === 1)
              .map((el, i) => (
                <SingleItemOfNavBar
                  key={el.id}
                  el={el}
                  i={el.id}
                  toggleMenu={false}
                  pickedSheduleComponent={pickedSheduleComponent}
                  setPickedSheduleComponent={setPickedSheduleComponent}
                  showNavBar={showNavBar}
                  setShowNavbar={setShowNavbar}
                />
              ))}
            {/* all schedules */}
            {schedules
              .filter((el, i) => el.id > 2)
              .map((el, i) => (
                <SingleItemOfNavBar
                  key={el.id}
                  el={el}
                  i={el.id}
                  toggleMenu={false}
                  pickedSheduleComponent={pickedSheduleComponent}
                  setPickedSheduleComponent={setPickedSheduleComponent}
                  showNavBar={showNavBar}
                  setShowNavbar={setShowNavbar}
                />
              ))}
          </div>
        </div>
        <div className="w-fit mt-5 flex flex-col p-5 overflow-y-scroll overflow-x-hidden scrollbar-none">
          {/* account / settings */}
          {schedules
            .filter((el, i) => el.id === 2)
            .map((el, i) => (
              <SingleItemOfNavBar
                key={el.id}
                el={el}
                i={el.id}
                toggleMenu={false}
                pickedSheduleComponent={pickedSheduleComponent}
                setPickedSheduleComponent={setPickedSheduleComponent}
                showNavBar={showNavBar}
                setShowNavbar={setShowNavbar}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
