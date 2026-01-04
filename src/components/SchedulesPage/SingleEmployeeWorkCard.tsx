import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";
type SingleEmployeeWorkCardType = {
  tab: InferSelectModel<typeof employees>[];
  title: string;
  employeeLogInRole: string;
};

export default function SingleEmployeeWorkCard({
  tab,
  title,
  employeeLogInRole,
}: SingleEmployeeWorkCardType) {
  const pathname = usePathname();
  console.log(employeeLogInRole);
  return (
    <div className="aspect-[2/1] max-h-max p-4 justify-center bg-teal-600 rounded-4xl m-4 text-white flex items-center flex-col gap-5">
      <p className="font-bold text-2xl">{title}</p>
      <div className="flex flex-col overflow-auto w-full scrollbar-thin m-4 gap-1 text-lg items-center">
        {tab.map((el) => (
          <Fragment key={el.id}>
            {employeeLogInRole === "admin" ? (
              <Link
                href={`${pathname}/${el.id}`}
                className="hover:text-xl transition-all ease-in-out cursor-pointer"
              >
                {el.name}
              </Link>
            ) : (
              <p className="hover:text-xl transition-all ease-in-out cursor-pointer">
                {el.name}
              </p>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
