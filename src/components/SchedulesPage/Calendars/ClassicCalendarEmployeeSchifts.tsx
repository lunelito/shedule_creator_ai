"use client";

import SecondaryButton from "@/components/UI/SecondaryButton";
import SecondaryInput from "@/components/UI/SecondaryInput";
import SelectGroup from "@/components/UI/SelectGroup";
import { employees, schedules_day } from "@/db/schema";
import { addVacations } from "@/lib/actions/Schedule/addVacations";
import { InferSelectModel } from "drizzle-orm";
import { ParamValue } from "next/dist/server/request/params";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
type ClassicCalendartype = {
  dataSingleScheduleDayOfEmployee: InferSelectModel<typeof schedules_day>[];
  scheduleId: ParamValue;
  employeeId: ParamValue;
  setError: React.Dispatch<SetStateAction<string>>;
};

type ParsedScheduleDay = {
  id: number;
  date: string | null;
  hours: string;
};

type vacations = {
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
  const [dateShow, setDateShow] = useState<string>("");
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
  const [reason, setReason] = useState<string>("");

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

  console.log(scheduleId, employeeId);

  const requestVacation = async () => {
    if (vacations.length === 0) {
      setError("Fill your vacation time!");
      setTimeout(() => setError(""), 2000);
      return 0;
    }

    if (scheduleId === undefined || employeeId === undefined) {
      setError("Please wait for your data!");
      setTimeout(() => setError(""), 2000);
      return 0;
    }

    if (reason.length === 0) {
      setError("Fill your reason field!");
      setTimeout(() => setError(""), 2000);
      return 0;
    }

    const formData = new FormData();

    formData.append("vacations", JSON.stringify(vacations));
    formData.append("schedule_id", scheduleId.toString());
    formData.append("employee_id", employeeId?.toString());
    formData.append("reason", reason);

    try {
      const result = await addVacations({ errors: {} }, formData);
      if (result.success) {
        setError("Vacation request send");
        setTimeout(() => setError(""), 2000);
        return { result: result };
      } else {
        const userErrors = result.errors.vacations?.[0]
          ? result.errors.vacations[0] + " in vacations fields"
          : null;
        const formError =
          result.errors._form?.[0] ?? "Error while inserting vacations";

        setError(userErrors ?? formError);
        return { result: result };
      }
    } catch (err) {
      console.error(err);
      setError("server error");
    }
  };

  useEffect(() => {
    if (calendarRef.current) {
      setCalendarHeight(calendarRef.current.offsetHeight);
    }
  }, [CalenderFull]);

  console.log(vacations);

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

              const hoursNum = daySchedule?.hours
                .split("-")
                .map(Number)
                .reduce((start, end) => end - start);

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (el !== null && !daySchedule) setDateShow(el);

                    if (!dayVacation) {
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
                    } else if (dayVacation) {
                      setVacations((prev) =>
                        prev.filter((v) => v.date !== dayVacation.date)
                      );
                    }
                  }}
                  className={`relative cursor-pointer h-16 p-4 rounded-lg flex justify-center items-center hover:scale-105 transition ${
                    daySchedule
                      ? "bg-teal-600 text-white border-2"
                      : "bg-white text-teal-600"
                  }`}
                >
                  <p className="text-sm">
                    {dayVacation
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
          <div
            style={{ height: calendarHeight }}
            className="w-[20vw] max-w-4xl bg-teal-600 p-4 rounded-lg"
          >
            <div
              className="flex flex-col justify-between items-center gap-5 bg-white h-full w-full p-10 rounded-xl"
              onDoubleClick={() => setDateShow("")}
            >
              <p className="text-zinc-800 text-3xl p-1 font-bold">
                {dateShow || "No date selected"}
              </p>

              <SelectGroup
                options={vacationsMap.map((el) => {
                  const val = el.replace("_", " ");
                  return (
                    val.slice(0, 1).toUpperCase() + val.slice(1, val.length)
                  );
                })}
                onChange={(value) =>
                  setVacationType(value.toLowerCase().replace(" ", "_"))
                }
              />

              <SecondaryInput
                name="note"
                text="Whats your reason?"
                type="text"
                onChange={(e) => setReason(e)}
              />
              <SecondaryButton
                bgColor={"bg-zinc-800"}
                onClick={requestVacation}
              >
                dodaj
              </SecondaryButton>
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
