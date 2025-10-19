import React, { useActionState } from "react";
import Input from "../UI/Input";
import * as actions from "@/lib/actions/action";
import { RegisterFormType, FieldsType } from "@/lib/actions/types/auth";

export default function RegisterForm({ setActiveForm }: RegisterFormType) {
  const [formState, action, isPending] = useActionState(actions.register, {
    errors: {},
  });

  // formState.errors.email === undefined
  // ? undefined //first render undefined for white font then blue/red
  // : formState.errors.email.length > 0,

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
        className="text-lg font-bold cursor-pointer hover:text-teal-600 transition ease-in-out hover:scale-105"
      >
        {isPending ? "Loading..." : "Register"}
      </button>
      <p
        className="text-center cursor-pointer hover:text-teal-600 transition ease-in-out hover:scale-105"
        onClick={() => setActiveForm("login")}
      >
        You created account? <br />
        Login here!
      </p>
    </form>
  );
}
