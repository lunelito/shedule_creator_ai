import React from "react";

type OurPlanType = {
  pageRef: React.RefObject<HTMLDivElement | null>;
};

export default function OurPlan({ pageRef }: OurPlanType) {
  return (
    <div className="w-full h-[100vh] flex flex-col" ref={pageRef}>
      <div className="h-full z-1 flex justify-center items-center">OurPlan</div>
    </div>
  );
}
