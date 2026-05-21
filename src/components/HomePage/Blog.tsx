import React from "react";
type BlogType = {
  pageRef: React.RefObject<HTMLDivElement | null>;
};
export default function Blog({ pageRef }: BlogType) {
  return (
    <div className="w-full h-[100vh] flex flex-col" ref={pageRef}>
      <div className="h-full z-1 flex justify-center items-center">Blog</div>
    </div>
  );
}
