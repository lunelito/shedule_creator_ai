"use client";
import SlideIn from "@/animations/SlideIn";
import SlideOut from "@/animations/SlideOut";
import LoginForm from "@/components/LoginRegister/LoginForm";
import RegisterForm from "@/components/LoginRegister/RegisterForm";
import Input from "@/components/UI/Input";
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
              {activeForm === "login" ? (
                <SlideIn key="login" animationKey="login" >
                  <LoginForm setActiveForm={setActiveForm} />
                </SlideIn>
              ) : (
                <SlideOut key="register" animationKey="register" >
                  <RegisterForm setActiveForm={setActiveForm} />
                </SlideOut>
              )}
            </AnimatePresence>
          </div>

          <div
            className={`text-white flex justify-center items-center h-1/2 w-full ${
              isVertical ? "hidden" : ""
            }`}
          >
            idk
          </div>
        </>
      )}
    </div>
  );
}
