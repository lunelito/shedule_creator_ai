"use client";
import RenderAnimation from "@/animations/RenderAnimation";
import UserSearchList from "@/components/addPage/UserSearchList";
import { InferSelectModel } from "drizzle-orm";
import { users } from "@/db/schema";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AddPageShedule() {
  const router = useRouter();
  // future create employeees on this tab
  const [userList, setUserList] = useState<InferSelectModel<typeof users>[]>(
    []
  );
  return (
    <RenderAnimation animationKey={"AddPage"}>
      <div className="flex w-full h-full flex-col p-10 justify-between md:flex-row">
        <div className="h-full w-full flex flex-col">
          {/* title of page */}
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
              Add Schedule
            </h1>
          </div>
          {/* ading employesss */}
          <div className="flex justify-center items-center">
            <UserSearchList userList={userList} setUserList={setUserList} />
          </div>
        </div>
        <div className="h-full w-full flex  flex-col justify-center items-center"></div>
      </div>
    </RenderAnimation>
  );
}
