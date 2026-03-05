"use client";

import {
  employees,
  schedules_day,
  time_off_requests,
} from "@/db/schema";
import { scheduleSwapRequestsFetchedType } from "@/lib/hooks/useScheduleFetch";
import { getInitials } from "@/lib/hooks/useTimeOff";
import { InferSelectModel } from "drizzle-orm";
import { ParamValue } from "next/dist/server/request/params";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

type RowCalendartype = {
  employeesTab: InferSelectModel<typeof employees>[];
  dataSingleScheduleDay: InferSelectModel<typeof schedules_day>[];
  scheduleId: ParamValue;
  organizationId: string;
  scheduleSwapRequestsFetched: scheduleSwapRequestsFetchedType[];
  timeOffRequestsData: InferSelectModel<typeof time_off_requests>[];
};

type EmployeeWithSchedule = InferSelectModel<typeof employees> & {
  schedule: InferSelectModel<typeof schedules_day>[];
};

export default function RowCalendar({
  employeesTab,
  scheduleId,
  dataSingleScheduleDay,
  organizationId,
  timeOffRequestsData,
  scheduleSwapRequestsFetched,
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
  const pathname = usePathname();

  //temp table
  const CalenderFull: string[] = [];

  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());
  const [hoveredSwapId, setHoveredSwapId] = useState<number | null>(null);

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
        (el) => el.assigned_employee_id === emp.id,
      ),
    }));

    setEmployees(mappedEmployees);
  }, [employeesTab, dataSingleScheduleDay]);

  for (let i = 1; i < daysInMonth + 1; i++) {
    const date = new Date(year, month, i + 1);
    CalenderFull.push(date.toISOString().split("T")[0]);
  }

  const RouteToAdd = (day: number, employeeId: number) => {
    const selectedDate = new Date(year, month, day);
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");
    const dateString = `${yyyy}-${mm}-${dd}`;
    router.replace(
      `/manage/add/addSheduleDay?date=${dateString}&schedule_id=${scheduleId}&organization_id=${organizationId}&employeeId=${employeeId}`,
    );
  };

  const timeOffMap = useMemo(() => {
    const map = new Map();
    timeOffRequestsData.forEach((el) => {
      if (el.status !== "declined") {
        const key = `${el.employee_id}_${el.date}`;
        map.set(key, el);
      }
    });
    return map;
  }, [timeOffRequestsData]);

  const swapByReceive = useMemo(() => {
    const map = new Map();
    scheduleSwapRequestsFetched.forEach((el) => {
      const req = el.scheduleSwapRequest;
      if (req.status !== "waiting") return;
      const date = new Date(req.date_recive).toISOString().split("T")[0];
      const key = `${req.employee_id_recive}_${date}`;
      map.set(key, el);
    });
    return map;
  }, [scheduleSwapRequestsFetched]);

  const swapByRequest = useMemo(() => {
    const map = new Map();
    scheduleSwapRequestsFetched.forEach((el) => {
      const req = el.scheduleSwapRequest;
      if (req.status !== "waiting") return;
      const date = new Date(req.date_request).toISOString().split("T")[0];
      const key = `${req.employee_id_request}_${date}`;
      map.set(key, el);
    });
    return map;
  }, [scheduleSwapRequestsFetched]);

  const scheduleMap = useMemo(() => {
    const map = new Map();
    employees?.forEach((emp) => {
      emp.schedule.forEach((s) => {
        const date = new Date(s.end_at).toISOString().split("T")[0];
        map.set(`${emp.id}_${date}`, s);
      });
    });
    return map;
  }, [employees]);

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
        <div className="flex gap-2 w-[80vw] bg-teal-600 p-4 rounded-lg overflow-auto scrollbar-thin">
          <div className="flex flex-col gap-2">
            <div
              className={`h-18 aspect-square p-4 rounded-lg flex justify-center items-center bg-transparent text-teal-600 hover:scale-105 transition ease-in-out `}
            />
            {employeesTab.map((el, i) => (
              <Link
                href={`${pathname}/${el.id}`}
                key={el.user_id}
                className={`h-18 aspect-square p-4 rounded-lg flex justify-center items-center bg-white text-teal-600 hover:scale-105 transition ease-in-out `}
              >
                {el.email}
              </Link>
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
                    const scheduleForDay = scheduleMap.get(`${emp.id}_${day}`);
                    const timeOffForDay = timeOffMap.get(`${emp.id}_${day}`);
                    const scheduleSwap =
                      swapByReceive.get(`${emp.id}_${day}`) ||
                      swapByRequest.get(`${emp.id}_${day}`);

                    const start = scheduleForDay
                      ? new Date(scheduleForDay.start_at).getHours()
                      : null;
                    const end = scheduleForDay
                      ? new Date(scheduleForDay.end_at).getHours()
                      : null;

                    const msg = timeOffForDay
                      ? getInitials(timeOffForDay.type, "_")
                      : scheduleSwap
                        ? "S"
                        : scheduleForDay
                          ? `${start} - ${end}`
                          : "-";

                    const isToday = day === date.toISOString().split("T")[0];
                    const isWaitingTimeOff =
                      timeOffForDay?.status === "waiting";
                    const hasSwapHighlight =
                      scheduleSwap &&
                      scheduleSwap.scheduleSwapRequest.id === hoveredSwapId;

                    return (
                      <div
                        onMouseEnter={() =>
                          scheduleSwap &&
                          setHoveredSwapId(scheduleSwap.scheduleSwapRequest.id)
                        }
                        onMouseLeave={() =>
                          scheduleSwap && setHoveredSwapId(null)
                        }
                        key={`emp-${emp.id}-day-${dayIndex}`}
                        onClick={() => RouteToAdd(dayIndex + 1, emp.id)}
                        className={`cursor-pointer text-center aspect-square h-18 p-2 rounded-lg flex justify-center items-center text-teal-600 hover:scale-105 transition ease-in-out ${
                          isWaitingTimeOff
                            ? "bg-white text-teal-600 animate-pulse"
                            : isToday
                              ? "bg-teal-600 text-white border-2"
                              : hasSwapHighlight
                                ? "bg-teal-600 text-white border-2 animate-pulse scale-105"
                                : "bg-white text-teal-600"
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
