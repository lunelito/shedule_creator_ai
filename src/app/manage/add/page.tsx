"use client"
import RenderAnimation from "@/animations/RenderAnimation";
import UserSearchList from "@/components/addPage/UserSearchList";
import React, { useState } from "react";
import { InferSelectModel } from "drizzle-orm";
import { users } from "@/db/schema";

export default function AddPage() {
  const [userList,setUserList] = useState<InferSelectModel<typeof users>[]>([]);
  return (
    <RenderAnimation animationKey={"AddPage"}>
      <div className="flex w-full h-full flex-col p-10 justify-between md:flex-row">
        <div className="h-full w-full flex p-10 flex-col justify-center items-center">
          tu jakis content
        </div>
        <div className="h-full w-full flex p-10 flex-col justify-center items-center">
          <UserSearchList userList={userList} setUserList={setUserList}/>
        </div>
      </div>
    </RenderAnimation>
  );
}
