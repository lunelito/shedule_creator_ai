import { ReactNode } from "react";

type primaryButtonType = {
  isPending?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

export default function PrimaryButton({
  isPending,
  children,
  onClick,
}: primaryButtonType) {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      type="submit"
      className={`text-lg font-bold cursor-pointer hover:text-teal-600 active:text-teal-600 transition ease-in-out active:scale-110 hover:scale-105 ${
        isPending ? "opacity-75" : ""
      }`}
    >
      {isPending ? "Loading..." : children}
    </button>
  );
}
