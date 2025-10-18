import React from "react";
import Input from "../UI/Input";

type LoginFormType = {
  setActiveForm: React.Dispatch<React.SetStateAction<string>>;
};

export default function LoginForm({ setActiveForm }: LoginFormType) {
  return (
    <form className="flex flex-col justify-center items-center gap-10 p-10 bg-zinc-800 rounded-xl">
      <Input type="text">email</Input>
      <Input type="password">password</Input>
      <button type="submit" className="text-lg font-bold cursor-pointer">
        login
      </button>
      <p
        className="text-center cursor-pointer"
        onClick={() => setActiveForm("register")}
      >
        You dont have account ? <br />
        Create One here!
      </p>
    </form>
  );
}
