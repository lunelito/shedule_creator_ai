"use client";
import RenderAnimation from "@/animations/RenderAnimation";
import React from "react";

import { signOut, useSession } from "next-auth/react";
import useFetch from "@/hooks/useFetch";
import { useUserDataContext } from "@/context/userContext";
import SettingsComponent from "@/components/SettingsComponent/SettingsComponent";

export default function SettingsPage() {
  const { userData, isPending } = useUserDataContext();

  //user data have all the info to display if is pendign amde an skeleton loader (look on talwind class pulse)
  //make an avatar component so you can change your icon

  const handleLogOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <RenderAnimation animationKey={"SettingsPage"}>
      <div className="flex w-full h-full flex-col p-10 justify-between md:flex-row">
        <div className="h-full w-full flex p-10 flex-col justify-center items-center">
          {isPending ? (
            <div>
              {/* skeleton later */}
              <p>loading settings...</p>
            </div>
          ) : (
            <SettingsComponent />
          )}
        </div>
        <div className="h-full w-full flex p-10 flex-col justify-center items-center">
          <button onClick={() => handleLogOut()}>Log Out</button>
        </div>
      </div>
    </RenderAnimation>
  );
}
