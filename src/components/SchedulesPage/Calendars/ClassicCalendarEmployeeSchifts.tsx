"use client";

import { employees, schedules_day } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { ParamValue } from "next/dist/server/request/params";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
type ClassicCalendartype = {
  dataSingleScheduleDayOfEmployee: InferSelectModel<typeof schedules_day>[];
};

type ParsedScheduleDay = {
  date: string | null;
  hours: string;
};

export default function ClassicCalendarEmployeeSchifts({
  dataSingleScheduleDayOfEmployee,
}: ClassicCalendartype) {
  // text to display and easier to map
  const daysOfWeek: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date: Date = new Date();

  const router = useRouter();

  //temp table
  const CalenderFull: (string | null)[] = [];

  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());

  const todayDate = date.toISOString().split("T")[0];

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  //   checking for first day in month to add blank spaces from other months
  let firstDayInMonth = (new Date(year, month, 1).getDay() + 6) % 7;
  const changeMonth = (amount: number) => {
    let newMonth = month + amount;
    let newYear = year;

    if (newMonth > 11) {
      newMonth = 0;
      newYear = year + 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear = year - 1;
    }

    setMonth(newMonth);
    setYear(newYear);
  };

  const parsedDataSingleScheduleDayOfEmployee: ParsedScheduleDay[] =
    dataSingleScheduleDayOfEmployee.map((el) => {
      const start = new Date(el.start_at).getHours();
      const end = new Date(el.end_at).getHours();
      const str = `${start} - ${end}`;

      return {
        date: el.date,
        hours: str,
      };
    });

  for (let i = 0; i < firstDayInMonth; i++) {
    CalenderFull.push(null);
  }

  //push rest of the day
  for (let i = 1; i < daysInMonth + 1; i++) {
    const date = new Date(year, month, i + 1);
    CalenderFull.push(date.toISOString().split("T")[0]);
  }

  return (
    <div className="flex m-5 justify-center">
      <button
        className="hover:scale-105 transition ease-in-out"
        onClick={() => changeMonth(-1)}
      >
        <Image
          className="rotate-270 invert"
          src={"/icons/arrowIcon.svg"}
          alt="arrow"
          width={50}
          height={50}
        />
      </button>
      <div className="flex flex-col items-center p-5">
        <p className="mb-4 text-white">
          {year}-{months[month]}
        </p>
        <div className="grid grid-cols-7 gap-2 w-[80vw] max-w-4xl bg-teal-600 p-4 rounded-lg">
          {daysOfWeek.map((el, i) => (
            <div
              key={i}
              className="flex justify-center h-16 text-center font-semibold text-white items-center"
            >
              <p>{el}</p>
            </div>
          ))}
          {CalenderFull.map((el, i) => {
            if (el === null) {
              return <div key={i} className="h-16 p-4 bg-transparent" />;
            }

            const daySchedule = parsedDataSingleScheduleDayOfEmployee.find(
              (d) => d.date === el
            );

            return (
              <div
                key={i}
                className={`cursor-pointer h-16 p-4 rounded-lg flex justify-center items-center hover:scale-105 transition ${
                  daySchedule
                    ? "bg-teal-600 text-white border-2"
                    : "bg-white text-teal-600"
                }`}
              >
                <p className="text-sm">
                  {daySchedule ? daySchedule.hours : ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <button
        className="hover:scale-105 transition ease-in-out invert"
        onClick={() => changeMonth(1)}
      >
        <Image
          className="rotate-90 "
          src={"/icons/arrowIcon.svg"}
          alt="arrow"
          width={50}
          height={50}
        />
      </button>
    </div>
  );
}
