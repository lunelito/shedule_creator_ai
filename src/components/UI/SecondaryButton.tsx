import { ReactNode } from "react";

type SecondaryButtonType = {
  isPending?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

export default function SecondaryButton({
  isPending,
  children,
  onClick,
}: SecondaryButtonType) {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      type="submit"
      className={`text-lg cursor-pointer bg-teal-600 w-fit py-1 px-5 rounded-xl transition ease-in-out active:scale-110 hover:scale-105 ${
        isPending ? "opacity-75" : ""
      }`}
    >
      {isPending ? "Loading..." : children}
    </button>
  );
}
