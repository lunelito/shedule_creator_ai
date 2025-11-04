"use client";
import React, { useActionState, useEffect } from "react";
import Input from "../UI/Input";
import * as actions from "@/lib/actions/action";
import { RegisterFormType, FieldsType } from "@/lib/actions/types/auth";
import SlideOutOnLoginRegister from "@/animations/SlideOutOnLoginRegister";
import PrimaryButton from "../UI/PrimaryButton";
import { AnimatePresence } from "framer-motion";
import FadeAnimation from "@/animations/FadeAnimation";

export default function RegisterForm({ setActiveForm }: RegisterFormType) {

  const [formState, action, isPending] = useActionState(actions.register, {
    errors: {},
  });

  const fields: FieldsType = [
    {
      type: "text",
      name: "firstName",
      text: "First Name",
      isInvalid: !!formState.errors.firstName,
      errorMessage: formState.errors.firstName ?? [],
    },
    {
      type: "text",
      name: "lastName",
      text: "Last Name",
      isInvalid: !!formState.errors.lastName,
      errorMessage: formState.errors.lastName ?? [],
    },
    {
      type: "text",
      name: "email",
      text: "Email",
      isInvalid: !!formState.errors.email,
      errorMessage: formState.errors.email ?? [],
    },
    {
      type: "password",
      name: "password",
      text: "Password",
      isInvalid: !!formState.errors.password,
      errorMessage: formState.errors.password ?? [],
    },
    {
      type: "password",
      name: "repeatPassword",
      text: "Repeat Password",
      isInvalid: !!formState.errors.repeatPassword,
      errorMessage: formState.errors.repeatPassword ?? [],
    },
  ];

  const formError = formState.errors._form;

  return (
    <SlideOutOnLoginRegister animationKey="register">
      <form
        action={action}
        className="flex flex-col justify-center items-center gap-10 p-8 sm:p-10 bg-zinc-800 rounded-xl shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:shadow-[0_0_25px_rgba(13,148,136,0.5)] transition-shadow ease-in-out duration-300 w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] xl:w-[30vw] max-w-[450px]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-3 text-teal-500">
          <h1 className="text-[clamp(1rem,6vw,2rem)] font-bold text-center sm:text-left">
            Register
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

        <PrimaryButton isPending={isPending}>Register</PrimaryButton>

        <p
          className="text-center text-sm sm:text-base cursor-pointer hover:text-teal-600 active:text-teal-600 transition ease-in-out active:scale-105 hover:scale-105"
          onClick={() => setActiveForm("login")}
        >
          You created account? <br />
          <span className="font-semibold">Login here!</span>
        </p>
      </form>
    </SlideOutOnLoginRegister>
  );
}
