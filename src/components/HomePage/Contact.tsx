import React from "react";

type ContactType = {
  pageRef: React.RefObject<HTMLDivElement | null>;
};

export default function Contact({ pageRef }: ContactType) {
  return (
    <div className="w-full h-[100vh] flex flex-col" ref={pageRef}>
      <div className="h-full z-1 flex justify-center items-center">Contact</div>
    </div>
  );
}
