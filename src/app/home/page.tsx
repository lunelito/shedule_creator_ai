"use client";
import RenderNavBar from "@/animations/RenderNavBar";
import ManagePage from "@/components/ManagePage";
import NavBar from "@/components/NavBar/NavBar";
import { useState } from "react";

export type scheduleType = {
  icon: string;
  text: string;
  id: number;
};

export default function Home() {
  const schedules: scheduleType[] = [
    { icon: "menu", text: "Dashboard", id: 0 },
    { icon: "addIcon", text: "New shedule", id: 1 },
    { icon: "accountIcon", text: "account", id: 2 },
    // for test icon will be changed
    { icon: "accountIcon", text: "test", id: 3 },
    { icon: "accountIcon", text: "test", id: 4 },
  ];
  const [pickedSheduleComponent, setPickedSheduleComponent] =
    useState<number>(0);

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-900 ">
      <RenderNavBar animationKey={"nav"}>
        <NavBar
          schedules={schedules}
          setPickedSheduleComponent={setPickedSheduleComponent}
          pickedSheduleComponent={pickedSheduleComponent}
        />
      </RenderNavBar>
      <ManagePage pickedSheduleComponent={pickedSheduleComponent} />
    </div>
  );
}
