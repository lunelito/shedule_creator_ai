import RenderAnimation from "@/animations/RenderAnimation";
import React from "react";

export default function MainPage() {
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
