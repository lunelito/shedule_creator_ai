import RenderAnimation from "@/animations/RenderAnimation";
import React from "react";

export default function AdminPanelPage() {
  // to do:
  // 1: show a list of users with the option to delete them, block them (ban them), or assign them the admin role
  // 2: after clicking on a user, it displays what they are doing: where they are added, what position they are on, and what schedules they belong to
  return (
    <RenderAnimation animationKey={"MainPage"}>
      <div className="flex w-full h-full flex-col p-10 justify-between md:flex-row">
        <div className="h-full w-full flex p-10 flex-col justify-center items-center">
          tu jakis content
        </div>
        <div className="h-full w-full flex p-10 flex-col justify-center items-center">
          main page
        </div>
      </div>
    </RenderAnimation>
  );
}
