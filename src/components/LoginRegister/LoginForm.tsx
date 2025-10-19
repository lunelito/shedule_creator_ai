import React, { useActionState } from "react";
import Input from "../UI/Input";
import * as actions from "@/lib/actions/action";
import { RegisterFormType,FieldsType } from "@/lib/actions/types/auth";


export default function LoginForm({ setActiveForm }: RegisterFormType) {
  const [formState, action, isPending] = useActionState(actions.logIn, {
    errors: {},
  });

  // formState.errors.email === undefined
  // ? undefined //first render undefined for white font then blue/red
  // : formState.errors.email.length > 0,

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
    }
  ];

  return (
    <form
      action={action}
      className="flex flex-col w-[40vw] justify-center items-center gap-10 p-10 bg-zinc-800 rounded-xl"
    >
      {fields.map((el, i) => (
        <Input
          isPending={isPending}
          key={i}
          type={el.type}
          name={el.name}
          isInvalid={el.isInvalid}
          errorMessage={el.errorMessage}
        >
          {el.text}
        </Input>
      ))}
      <button
        disabled={isPending}
        type="submit"
        className={`text-lg font-bold cursor-pointer hover:text-teal-600 transition ease-in-out hover:scale-105 ${isPending ? "opacity-75" : ""}`}
      >
        {isPending ? "Loading..." : "Login"}
      </button>
      <p
        className="text-center cursor-pointer hover:text-teal-600 transition ease-in-out hover:scale-105"
        onClick={() => setActiveForm("register")}
      >
        You don’t have an account yet? <br />
        Register here!
      </p>
    </form>
  );
}
