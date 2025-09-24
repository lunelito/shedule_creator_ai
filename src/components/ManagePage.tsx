import React from "react";
import DashBoardPage from "./MainPageComponents/DashBoardPage";
import AddShedulePage from "./MainPageComponents/AddShedulePage";
import SettingsPage from "./MainPageComponents/SettingsPage";
import Shedule from "./MainPageComponents/Shedule";

type ManagePageType = {
  pickedSheduleComponent: number;
};

export default function ManagePage({ pickedSheduleComponent }: ManagePageType) {
  return (
    <div className="h-screen w-full bg-zinc-900 flex justify-center items-center">
      {pickedSheduleComponent === 0 && <DashBoardPage/>}
      {pickedSheduleComponent === 1 && <AddShedulePage/>}
      {pickedSheduleComponent === 2 && <SettingsPage/>}
      {pickedSheduleComponent > 2 && <Shedule/>}
    </div>
  );
}
