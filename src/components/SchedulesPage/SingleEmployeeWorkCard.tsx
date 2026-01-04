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
  return (
    <div className="aspect-[2/1] lg:aspect-[2/2] 2xl:aspect-[2/1] max-h-max p-4 justify-center bg-teal-600 rounded-4xl m-1 xl:m-4 2xl:m-8 text-white flex items-center flex-col gap-5 lg:gap-1">
      <p className="font-bold text-[clamp(1.25rem,2.5vw,2rem)] lg:text-[clamp(1.25rem,2.5vw,1rem)] text-center">
        {title}
      </p>
      <div className="flex flex-col overflow-auto w-full scrollbar-thin m-4 gap-1 items-center">
        {tab.map((el) => (
          <Fragment key={el.id}>
            {employeeLogInRole === "admin" ? (
              <Link
                href={`${pathname}/${el.id}`}
                className="hover:text-[clamp(1.125rem,2vw,1.5rem)] transition-all ease-in-out duration-200 cursor-pointer text-[clamp(1rem,1.75vw,1.25rem)] py-2 hover:bg-teal-700/50 rounded-lg w-full text-center"
              >
                {el.name}
              </Link>
            ) : (
              <p className="hover:text-[clamp(1.125rem,2vw,1.5rem)] transition-all ease-in-out duration-200 cursor-pointer text-[clamp(1rem,1.75vw,1.25rem)] py-2 hover:bg-teal-700/50 rounded-lg w-full text-center">
                {el.name}
              </p>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
