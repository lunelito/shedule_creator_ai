"use client";
import { useState } from "react";
import React from "react";
import { scheduleType, linksType } from "@/app/manage/layout";
import SingleStaticItem from "./SingleStaticItem";

type NavBarProps = {
  schedules: scheduleType[];
  links: linksType[];
};

export default function NavBar({ schedules, links }: NavBarProps) {
  const [showNavBar, setShowNavbar] = useState(false);
  const [pickedSheduleComponent, setPickedSheduleComponent] = useState(0);

  return (
    <div
      className=" bg-zinc-800 h-screen flex relative  w-fit"
      onMouseEnter={() => setShowNavbar(true)}
      onMouseLeave={() => setShowNavbar(false)}
    >
      <div className="flex flex-col justify-between">
        <div className=" w-fit flex  flex-col p-5 justify-between">
          <div className="w-fit  mt-5 flex flex-col gap-5 overflow-y-scroll overflow-x-hidden h-[80vh] scrollbar-none">
            {/*dashcboard*/}
            {links
              .filter((el) => el.label === "Dashboard")
              .map((el, i) => (
                <SingleStaticItem
                  key={el.id}
                  href={el.href}
                  icon={el.icon}
                  label={el.label}
                  id={el.id}
                  pickedSheduleComponent={pickedSheduleComponent}
                  setPickedSheduleComponent={setPickedSheduleComponent}
                  showNavBar={showNavBar}
                  setShowNavbar={setShowNavbar}
                />
              ))}
            {/* add */}
            {links
              .filter((el) => el.label === "New shedule")
              .map((el, i) => (
                <SingleStaticItem
                  key={el.id}
                  href={el.href}
                  icon={el.icon}
                  label={el.label}
                  id={el.id}
                  pickedSheduleComponent={pickedSheduleComponent}
                  setPickedSheduleComponent={setPickedSheduleComponent}
                  showNavBar={showNavBar}
                  setShowNavbar={setShowNavbar}
                />
              ))}
            {/* shedules */}
            {schedules
              .filter((el, i) => el.id > 2)
              .map((el, i) => (
                <SingleStaticItem
                  key={el.id}
                  href={`/manage/schedules/${el.slug}`}
                  icon={el.icon}
                  label={el.label}
                  id={el.id}
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
          {links
            .filter((el) => el.label === "Account")
            .map((el, i) => (
              <SingleStaticItem
                key={el.id}
                href={el.href}
                icon={el.icon}
                label={el.label}
                id={el.id}
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
