import React from "react";

type AboutUsType = {
  pageRef: React.RefObject<HTMLDivElement | null>;
};

export default function AboutUs({ pageRef }: AboutUsType) {
  return (
    <div className="w-full h-[100vh] flex flex-col" ref={pageRef}>
      <div className="h-full z-1 flex justify-center items-center">AboutUs</div>
    </div>
  );
}
