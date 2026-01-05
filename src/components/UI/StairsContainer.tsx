import React from "react";

type StairsContainerType = {
  children: React.ReactNode;
  props?: string;
  className?:string
};

export default function StairsContainer({
  children,
  props,
  className
}: StairsContainerType) {
  return (
    <div className={`bg-zinc-600/10 rounded-xl p-1.5 ${props}`}>
      <div className="bg-zinc-600/30 rounded-xl w-full h-full p-1.5">
        <div className="bg-zinc-600/50 rounded-xl w-full h-full p-1.5">
          <div className="bg-zinc-600/80 rounded-xl w-full h-full p-1.5">
            <div className={`bg-zinc-900 p-1.5 rounded-xl w-full h-full ${className}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
