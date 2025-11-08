import RenderAnimation from "@/animations/RenderAnimation";
import React from "react";

export default function AddPage() {
  return (
    <RenderAnimation animationKey={"AddPage"}>
      <div className="flex w-full h-full flex-col p-10 justify-between md:flex-row">
        <div className="h-full w-full flex p-10 flex-col justify-center items-center">
          tu jakis content
        </div>
        <div className="h-full w-full flex p-10 flex-col justify-center items-center">
          b
        </div>
      </div>
    </RenderAnimation>
  );
}
