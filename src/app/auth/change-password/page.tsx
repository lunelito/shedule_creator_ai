"use client";
import SlideIn from "@/animations/SlideIn";
import SlideOut from "@/animations/SlideOut";
import ChangePasswordForm from "@/components/LoginRegister/ChangePasswordForm";
import LoginForm from "@/components/LoginRegister/LoginForm";
import RegisterForm from "@/components/LoginRegister/RegisterForm";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [isVertical, setIsVertical] = useState<boolean | null>(null);
  const [activeForm, setActiveForm] = useState<string>("login");

  useEffect(() => {
    const checkOrientation = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    checkOrientation();

    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  return (
    <div className="bg-zinc-900 h-screen w-[100vw] flex justify-center items-center overflow-x-hidden overflow-y-hidden">
      {isVertical !== null && (
        <>
          <div className="text-white flex justify-center items-center h-1/2 w-[100vw]">
            <AnimatePresence mode="wait">
                <SlideIn key="login" animationKey="login" >
                  <ChangePasswordForm setActiveForm={setActiveForm} />
                </SlideIn>
            </AnimatePresence>
          </div>

          <div
            className={`text-white flex justify-center items-center h-1/2 w-full ${
              isVertical ? "hidden" : ""
            }`}
          >
            future logo
          </div>
        </>
      )}
    </div>
  );
}

