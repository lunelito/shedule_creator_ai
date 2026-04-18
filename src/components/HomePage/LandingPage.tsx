import React from "react";
import CubesMap from "./CubesMap";

export default function LandingPage() {
  return (
    <div className="w-full h-[95vh] flex flex-col">
      <div className="h-3/5 flex justify-center items-center">
        <p className="text-xl font-bold xl:text-6xl lg:text-5xl sm:text-3xl">
          Schedules that work as hard as your team.
        </p>
      </div>
      <div className="h-2/5 relative">
        <CubesMap />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-900 pointer-events-none" />

      </div>
    </div>
  );
}
