"use client";

import { employees, schedules_day } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { ParamValue } from "next/dist/server/request/params";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type RowCalendartype = {
  employeesTab: InferSelectModel<typeof employees>[];
  scheduleId: ParamValue;
  dataSingleScheduleDay: InferSelectModel<typeof schedules_day>[];
  organizationId: string;
};

type EmployeeWithSchedule = InferSelectModel<typeof employees> & {
  schedule: InferSelectModel<typeof schedules_day>[];
};

export default function RowCalendar({
  employeesTab,
  scheduleId,
  dataSingleScheduleDay,
  organizationId,
}: RowCalendartype) {
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
  const [employees, setEmployees] = useState<EmployeeWithSchedule[]>();

  const date: Date = new Date();
  const router = useRouter();

  //temp table
  const CalenderFull: string[] = [];

  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());

  const todayDate = date.toISOString().split("T")[0];

  const daysInMonth = new Date(year, month + 1, 0).getDate();

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

  useEffect(() => {
    if (!employeesTab || !dataSingleScheduleDay) return;

    const mappedEmployees = employeesTab.map((emp) => ({
      ...emp,
      schedule: dataSingleScheduleDay.filter(
        (el) => el.assigned_employee_id === emp.id
      ),
    }));

    setEmployees(mappedEmployees);
  }, [employeesTab, dataSingleScheduleDay]);

  console.log(employees);

  for (let i = 1; i < daysInMonth + 1; i++) {
    const date = new Date(year, month, i + 1);
    CalenderFull.push(date.toISOString().split("T")[0]);
  }
  console.log(year);

  const RouteToAdd = (day: number, employeeId: number) => {
    const selectedDate = new Date(year, month, day);
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");
    const dateString = `${yyyy}-${mm}-${dd}`;
    router.replace(
      `/manage/add/addSheduleDay?date=${dateString}&schedule_id=${scheduleId}&organization_id=${organizationId}&employeeId=${employeeId}`
    );
  };

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
        <div className="flex w-[80vw] gap-2 max-w-4xl bg-teal-600 p-4 rounded-lg overflow-auto scrollbar-thin">
          <div className="flex flex-col gap-2">
            <div
              className={`h-18 aspect-square p-4 rounded-lg flex justify-center items-center bg-transparent text-teal-600 hover:scale-105 transition ease-in-out `}
            />
            {employeesTab.map((el, i) => (
              <div
                key={el.user_id}
                className={`h-18 aspect-square p-4 rounded-lg flex justify-center items-center bg-white text-teal-600 hover:scale-105 transition ease-in-out `}
              >
                {el.email}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {CalenderFull.map((el, i) => (
                <div
                  key={`${i}daysOfMonth`}
                  className={`cursor-pointer aspect-square h-18 p-2 rounded-lg flex justify-center items-center text-teal-600 hover:scale-105 transition ease-in-out ${
                    i + 1 === date.getDate()
                      ? "bg-teal-600 text-white border-2"
                      : "bg-white"
                  }`}
                >
                  <p>{i + 1}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {CalenderFull.map((day, dayIndex) => (
                <div className="flex flex-col gap-2" key={`day-${dayIndex}`}>
                  {employees?.map((emp) => {
                    const scheduleForDay = emp.schedule.find((scheduledDay) => {
                      const scheduledDate = new Date(scheduledDay.end_at)
                        .toISOString()
                        .split("T")[0];
                      return scheduledDate === day;
                    });

                    const start = scheduleForDay
                      ? new Date(scheduleForDay.start_at).getHours()
                      : null;
                    const end = scheduleForDay
                      ? new Date(scheduleForDay.end_at).getHours()
                      : null;
                    const msg = scheduleForDay ? `${start} - ${end}` : "-";

                    return (
                      <div
                        key={`emp-${emp.id}-day-${dayIndex}`}
                        onClick={() =>
                          RouteToAdd(
                            dayIndex + 1,
                            emp.id
                          )
                        }
                        className={`cursor-pointer text-center aspect-square h-18 p-2 rounded-lg flex justify-center items-center text-teal-600 hover:scale-105 transition ease-in-out ${
                          day === date.toISOString().split("T")[0]
                            ? "bg-teal-600 text-white border-2"
                            : "bg-white"
                        }`}
                      >
                        {msg}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
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
