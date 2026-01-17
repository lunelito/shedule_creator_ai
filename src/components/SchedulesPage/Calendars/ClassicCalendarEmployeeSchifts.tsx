"use client";

import SecondaryButton from "@/components/UI/SecondaryButton";
import SecondaryInput from "@/components/UI/SecondaryInput";
import SelectGroup from "@/components/UI/SelectGroup";
import { employees, schedules_day, time_off_requests } from "@/db/schema";
import { addVacations } from "@/lib/actions/Vacations/addVacations";
import { InferSelectModel } from "drizzle-orm";
import { ParamValue } from "next/dist/server/request/params";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import VacationExtension from "./CalendarsExtensions/VacationExtension";
import { getInitials } from "@/lib/hooks/useTimeOff";
import PrimaryButton from "@/components/UI/PrimaryButton";
type ClassicCalendartype = {
  dataSingleScheduleDayOfEmployee: InferSelectModel<typeof schedules_day>[];
  scheduleId: ParamValue;
  employeeId: ParamValue;
  timeOffRequestsData: InferSelectModel<typeof time_off_requests>[];
  setTimeOffRequestsData: React.Dispatch<
    SetStateAction<InferSelectModel<typeof time_off_requests>[]>
  >;
  setError: React.Dispatch<SetStateAction<string>>;
  role: string;
};

type ParsedScheduleDay = {
  id: number;
  date: string | null;
  hours: string;
};

export type vacations = {
  date: string;
  type: string;
  isScheduled: boolean;
  scheduledHours: number;
  schedule_day_id: number | null;
};

export default function ClassicCalendarEmployeeSchifts({
  dataSingleScheduleDayOfEmployee,
  scheduleId,
  employeeId,
  setError,
  role,
  timeOffRequestsData,
  setTimeOffRequestsData,
}: ClassicCalendartype) {
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

  const CalenderFull: (string | null)[] = [];

  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());
  const [calendarHeight, setCalendarHeight] = useState(0);
  const calendarRef = useRef<HTMLDivElement>(null);
  const vacationsMap = [
    "paid_leave",
    "unpaid_leave",
    "sick_leave",
    "parental_leave",
    "special_leave",
    "training_leave",
    "other_leave",
  ];
  const [vacations, setVacations] = useState<vacations[]>([]);
  const [vacationType, setVacationType] = useState<string>("paid_leave");
  const [showVacationPanel, setShowVacationPanel] = useState<boolean>(false);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

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
        id: el.id,
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

  useEffect(() => {
    if (calendarRef.current) {
      setCalendarHeight(calendarRef.current.offsetHeight);
    }
  }, [CalenderFull]);

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
        <div className="flex justify-center items-center gap-10">
          <div
            ref={calendarRef}
            className="grid grid-cols-7 gap-2 w-[80vw] max-w-4xl bg-teal-600 p-4 rounded-lg"
          >
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

              const dayVacation = vacations.find((d) => d.date === el);

              const timeOffForDay = timeOffRequestsData.find((timeOff) => {
                return (
                  timeOff.date === el &&
                  timeOff.employee_id === Number(employeeId) &&
                  timeOff.status !== "declined"
                );
              });

              const hoursNum = daySchedule?.hours
                .split("-")
                .map(Number)
                .reduce((start, end) => end - start);

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (!showVacationPanel) return;
                    // !!!!!!!!
                    // in future make it a requst for not having a time off !!!!! schould be easy implementation.
                    if (!dayVacation && !timeOffForDay) {
                      setVacations((prev) => [
                        ...prev,
                        {
                          date: el,
                          type: vacationType,
                          isScheduled: !!daySchedule,
                          scheduledHours: daySchedule ? hoursNum ?? 0 : 0,
                          schedule_day_id: daySchedule ? daySchedule.id : null,
                        },
                      ]);
                    } else if (dayVacation && !timeOffForDay) {
                      setVacations((prev) =>
                        prev.filter((v) => v.date !== dayVacation.date)
                      );
                    }
                  }}
                  className={`relative cursor-pointer h-16 p-4 rounded-lg flex justify-center items-center hover:scale-105 transition ${
                    timeOffForDay?.status === "waiting"
                      ? "bg-white text-teal-600 animate-pulse"
                      : daySchedule
                      ? "bg-teal-600 text-white border-2"
                      : "bg-white text-teal-600"
                  }`}
                >
                  <p className="text-sm">
                    {timeOffForDay
                      ? getInitials(timeOffForDay.type, "_")
                      : dayVacation
                      ? dayVacation.type
                      : daySchedule
                      ? daySchedule.hours
                      : ""}
                  </p>
                  {dayVacation && (
                    <div className="absolute -top-2 -left-2 ">
                      <button
                        onClick={() =>
                          setVacations((prev) =>
                            prev.filter((el) => el.date !== dayVacation.date)
                          )
                        }
                        className=" cursor-pointer relative bg-white border-teal-600 border-1 h-4 w-4 rounded-full flex items-center justify-center"
                      >
                        <Image
                          src={`/Icons/minus-teal.svg`}
                          alt="cross"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {showVacationPanel && (
            <VacationExtension
              calendarHeight={calendarHeight}
              employeeId={employeeId}
              scheduleId={scheduleId}
              setError={setError}
              setVacationType={setVacationType}
              vacations={vacations}
              vacationsMap={vacationsMap}
              setVacations={setVacations}
              setTimeOffRequestsData={setTimeOffRequestsData}
            />
          )}
        </div>
        {/* !!!!!!!!!!!!!!!!!!! */}
        {/* if you finish change it to role !== "admin" */}
        {role === "admin" && (
          <div className="mt-5">
            <PrimaryButton
              onClick={() => setShowVacationPanel((prev) => !prev)}
            >
              Time off panel
            </PrimaryButton>
          </div>
        )}
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
