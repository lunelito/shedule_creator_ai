"use client";
import RenderAnimation from "@/animations/RenderAnimation";
import React from "react";

import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const handleLogOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };
  return (
    <div>
      <RenderAnimation animationKey={"SettingsPage"}>
        <button onClick={() => handleLogOut()}>Log Out</button>
      </RenderAnimation>
    </div>
  );
}
