import React from "react";
import { HashLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-64 w-full h-full">
      <HashLoader color="oklch(60% 0.118 184.704)" size={50} />
    </div>
  );
}
