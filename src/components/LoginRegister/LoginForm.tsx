import React, { useActionState, useEffect } from "react";
import Input from "../UI/Input";
import { useRouter } from "next/navigation";
import * as actions from "@/lib/actions/action";
import { RegisterFormType, FieldsType } from "@/lib/actions/types/auth";
import SlideOutOnLoginRegister from "@/animations/SlideOutOnLoginRegister";

export default function LoginForm({ setActiveForm }: RegisterFormType) {
  const [formState, action, isPending] = useActionState(actions.logIn, {
    errors: {},
  });

  const router = useRouter();

  useEffect(() => {
    if (formState.success) {
      const timer = setTimeout(() => {
        router.push("/home");
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [formState.success, router]);

  const fields: FieldsType = [
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
  ];

  return (
    <SlideOutOnLoginRegister animationKey="login" when={formState.success}>
      <form
        action={action}
        className="flex flex-col w-[40vw] justify-center items-center gap-7 p-10 bg-zinc-800 rounded-xl"
      >
        {/* <h1 className="p-2 text-teal-600 text-left w-full text-[clamp(3rem, 8vw, 6rem)] font-bold">
          Login Form
        </h1> */}
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
        <button
          disabled={isPending}
          type="submit"
          className={`text-lg font-bold cursor-pointer hover:text-teal-600 active:text-teal-600 transition ease-in-out active:scale-105 hover:scale-105 ${
            isPending ? "opacity-75" : ""
          }`}
        >
          {isPending ? "Loading..." : "Login"}
        </button>

        {/* <div className="flex items-center w-full justify-center gap-4 my-4">
          <div className="flex-1 h-px bg-white"></div>
          <p className="text-white text-sm font-medium">or</p>
          <div className="flex-1 h-px bg-white"></div>
        </div>

        <div className="flex gap-10">
          <div className="flex justify-center items-center gap-2">
            <img
              src="/Icons/github-white.svg"
              alt="GitHub"
              className="w-7 h-7 transition-colors duration-200 filter hover:invert-0 hover:brightness-125"
            />
            <p>Login with Github</p>
          </div>
          <div className="flex justify-center items-center gap-2">
            <img src="/Icons/google.svg" alt="GitHub" className="w-7 h-7" />
            <p>Login with Github</p>
          </div>
        </div> */}

        <p
          className="text-center cursor-pointer hover:text-teal-600 active:text-teal-600 transition ease-in-out active:scale-105 hover:scale-105"
          onClick={() => setActiveForm("register")}
        >
          You don’t have an account yet? <br />
          Register here!
        </p>
      </form>
    </SlideOutOnLoginRegister>
  );
}
