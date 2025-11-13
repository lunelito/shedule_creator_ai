"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.scheduleId;

  return (
    <div className="h-screen w-full p-6">
      <div className="flex items-center w-fit gap-4  p-4 rounded-lg hover:scale-110 transition-all ease-in-out">
        <button onClick={() => router.back()}>
          <Image
            src={"/Icons/arrowIcon.svg"}
            width={50}
            height={50}
            alt="arrow"
            className="rotate-270 invert"
          />
        </button>
        <h1 className="text-[clamp(1rem,6vw,2rem)] font-bold text-white">
          Schedule ID: {scheduleId}
        </h1>
      </div>
    </div>
  );
}
