"use client";
import React, { useState, useEffect } from "react";
import Input from "../UI/Input";
import { useRouter } from "next/navigation";
import * as actions from "@/lib/actions/action";
import { RegisterFormType, FieldsType } from "@/lib/actions/types/auth";
import SlideOutOnLoginRegister from "@/animations/SlideOutOnLoginRegister";
import PrimaryButton from "../UI/PrimaryButton";
import { AnimatePresence } from "framer-motion";
import FadeAnimation from "@/animations/FadeAnimation";
import LoginButtons from "./LoginButtons";

export default function ChangePasswordForm({ setActiveForm }: RegisterFormType) {
  const [formState, setFormState] = useState<{
    errors: any;
    success?: boolean;
  }>({
    errors: {},
  });

  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget) as any;

      const res = await fetch("/api/changePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          // userId: userId
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/manage/main");
      }
    } catch (err) {
      setFormState({
        errors: { _form: ["Something went wrong..."] },
      });
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (formState.success) {
      const timer = setTimeout(() => {
        router.push("/manage/main");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [formState.success, router]);

  const fields: FieldsType = [
    {
      type: "text",
      name: "oldPassword",
      text: "Old password",
      isInvalid: !!formState.errors.currentPassword,
      errorMessage: formState.errors.currentPassword ?? [],
    },
    {
      type: "password",
      name: "newPassword",
      text: "New Password",
      isInvalid: !!formState.errors.newPassword,
      errorMessage: formState.errors.newPassword ?? [],
    },
        {
      type: "password",
      name: "confirmNewPassword",
      text: "Confirm new password",
      isInvalid: !!formState.errors.newPassword,
      errorMessage: formState.errors.newPassword ?? [],
    },
  ];

  const formError = formState.errors._form

  return (
    <SlideOutOnLoginRegister animationKey="login" when={formState.success}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-10 p-8 sm:p-10 bg-zinc-800 rounded-xl shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:shadow-[0_0_25px_rgba(13,148,136,0.5)] transition-shadow ease-in-out duration-300 w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] xl:w-[30vw] max-w-[450px]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-3 text-teal-500">
          <h1 className="text-[clamp(1rem,6vw,2rem)] font-bold text-center sm:text-left">
            Change Password
          </h1>
          <AnimatePresence mode="wait">
            {formError && (
              <FadeAnimation
                animationKey={`errorMessage-${formError?.[0] || "unknown"}`}
              >
                <p className="text-teal-600 text-sm sm:text-base text-center sm:text-right">
                  {formError?.[0]}
                </p>
              </FadeAnimation>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full flex flex-col gap-5">
          {fields.map((el, i) => (
            <Input
              isPending={isPending}
              key={i}
              type={el.type}
              name={el.name}
              isInvalid={el.isInvalid}
              errorMessage={el.errorMessage}
              text={el.text}
            />
          ))}
        </div>

        <PrimaryButton isPending={isPending}>Confirm</PrimaryButton>

        {/* <div className="flex items-center w-full justify-center gap-4 my-4">
          <div className="flex-1 h-px bg-white"></div>
          <p className="text-white text-sm font-medium">or</p>
          <div className="flex-1 h-px bg-white"></div>
        </div> */}

        {/* <LoginButtons /> */}

        {/* <p
          className="text-center text-sm sm:text-base cursor-pointer hover:text-teal-600 active:text-teal-600 transition ease-in-out active:scale-105 hover:scale-105"
          onClick={() => setActiveForm("register")}
        >
          You don’t have an account yet? <br />
          <span className="font-semibold">Register here!</span>
        </p> */}
      </form>
    </SlideOutOnLoginRegister>
  );
}
