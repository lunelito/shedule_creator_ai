import { useState } from "react";

type InputType = {
  children: React.ReactNode;
  type: "password" | "text" | "number";
  name: string;
  isInvalid: boolean | undefined;
  errorMessage: string[];
};

export default function Input({
  children,
  type,
  name,
  isInvalid,
  errorMessage,
}: InputType) {
  const [val, setVal] = useState("");

  console.log(isInvalid, errorMessage);

  return (
    <div
      className={`relative ${
        isInvalid
          ? "text-red-600" // błąd
          : "text-white" // poprawne
      } font-extrabold p-2 pl-4 pr-4 w-[90%]`}
    >
      <input
        id={`${children}`}
        name={`${name}`}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        type={type}
        className={` w-[100%] peer border-b bg-inherit py-1 font-bold transition-colors focus:border-b-2 focus:outline-none `}
      />
      <label
        htmlFor={`${children}`}
        className={`absolute p-2 pl-4 pr-4 left-0 cursor-text transition-all select-none peer-focus:-top-5 peer-focus:text-lg w-[90%] ${
          (val || "").length === 0 ? "top-1 text-xl" : "-top-5 text-sm"
        }`}
      >
        {children}
      </label>
      <div className="flex justify-start mt-2 text-sm">
        {isInvalid && errorMessage[0]}
      </div>
    </div>
  );
}
