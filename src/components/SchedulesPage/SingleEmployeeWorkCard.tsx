import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
type SingleEmployeeWorkCardType = {
  tab: InferSelectModel<typeof employees>[];
  title: string;
};

export default function SingleEmployeeWorkCard({
  tab,
  title,
}: SingleEmployeeWorkCardType) {
  const pathname = usePathname();
  return (
    <div className="aspect-[4/3] max-h-max p-4 justify-center bg-white rounded-4xl m-4 text-teal-600 flex items-center flex-col gap-5">
      <p className="font-bold text-2xl">{title}</p>
      <div className="flex flex-col overflow-auto w-full scrollbar-thin m-4 gap-1 text-lg items-center">
        {tab.map((el) => (
          <Link
            href={`${pathname}/${el.id}`}
            key={el.id}
            className="hover:scale-105 transition-all ease-in-out cursor-pointer"
          >
            {el.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
