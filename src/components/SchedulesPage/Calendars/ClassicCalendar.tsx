"use client";

import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { ParamValue } from "next/dist/server/request/params";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
type ClassicCalendartype = {
  scheduleId: ParamValue;
  organizationId: ParamValue;
};

export default function ClassicCalendar({
  scheduleId,
  organizationId,
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
  const CalenderFull = [];

  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());
  const day = date.getDay();
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

  //push blank spots if month starts not in monady
  for (let i = 0; i < firstDayInMonth; i++) {
    CalenderFull.push(null);
  }

  //push rest of the day
  for (let i = 0; i < daysInMonth; i++) {
    CalenderFull.push({
      day: i + 1,
      workers: [],
    });
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
        <p className="mb-4 text-white">Today is {todayDate}</p>
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
          {CalenderFull.map((el, i) => (
            <div
              onClick={() => {
                const selectedDate = new Date(year, month, el?.day);
                const yyyy = selectedDate.getFullYear();
                const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
                const dd = String(selectedDate.getDate()).padStart(2, "0");
                const dateString = `${yyyy}-${mm}-${dd}`;
                router.replace(
                  `/manage/add/addSheduleDay?date=${dateString}&schedule_id=${scheduleId}&organization_id=${organizationId}`
                );
              }}
              key={i}
              className={`cursor-pointer h-16 p-4 rounded-lg flex justify-center items-center text-teal-600 hover:scale-105 transition ease-in-out ${
                el?.day === date.getDate() &&
                month === date.getMonth() &&
                year === date.getFullYear()
                  ? "bg-teal-600 text-white border-2"
                  : "bg-white"
              }`}
            >
              <p>{el?.day}</p>
            </div>
          ))}
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
