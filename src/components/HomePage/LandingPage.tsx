import React, { useState } from "react";
import HeroCubes from "./HeroCubes";
import ScaleAnimation from "@/animations/ScaleAnimation";

export default function LandingPage() {
  return (
    <div className="w-full h-[95vh] flex flex-col ">
      <div className="h-full z-1 flex justify-center items-center">
        <ScaleAnimation
          scale={0.8}
          animationKey={`centerText`}
          key={`centerText`}
        >
          <div className="flex flex-col gap-16">
            <p className="text-3xl font-bold xl:text-8xl lg:text-7xl sm:text-5xl text-center">
              Schedules that work as hard as your team.
            </p>
            <div className="text-2xl xl:text-6xl lg:text-5xl sm:text-4xl text-center flex flex-col items-center gap-8">
              <p>Be the first to know when we launch !</p>
              <div className="bg-zinc-900/95 rounded-2xl w-fit p-2 flex justify-center gap-4">
                <input
                  type="email"
                  className="text-lg border-transparent border-2 rounded-xl transition-all ease-in-out focus:border-teal-600 outline-0 p-2"
                  placeholder="your email..."
                />
                <button className="text-lg text-center py-2 px-8 bg-teal-800 rounded-xl cursor-pointer hover:rotate-2 hover:scale-105 transition-all ease-in-out">
                  Add
                </button>
              </div>
            </div>
          </div>
        </ScaleAnimation>
      </div>
      {/* hero */}
      <HeroCubes />
    </div>
  );
}
