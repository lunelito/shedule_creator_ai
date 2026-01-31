"use client";

import { employees, schedules_day, time_off_requests } from "@/db/schema";
import { getInitials } from "@/lib/hooks/useTimeOff";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import SchiftSwapExtension from "./CalendarsExtensions/SchiftSwapExtension";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { useScheduleLogic } from "@/lib/hooks/useScheduleLogic";
import DeleteIcon from "@/components/UI/DeleteIcon";

type RowCalendartype = {
  dataSingleScheduleDay: InferSelectModel<typeof schedules_day>[];
  timeOffRequestsData: InferSelectModel<typeof time_off_requests>[];
  employeesTabFetched: InferSelectModel<typeof employees>[];
  employeeId: string | string[];
  role: string;
  setError: React.Dispatch<SetStateAction<string>>;
  threeMonthScheduleDayAllFetched: InferSelectModel<typeof schedules_day>[][];
};

type EmployeeWithSchedule = InferSelectModel<typeof employees> & {
  schedule: InferSelectModel<typeof schedules_day>[];
};

export type ShiftSwapState = {
  offeredShift: {
    shift: InferSelectModel<typeof schedules_day> | null | "time_off";
    date: string | null;
    employee: InferSelectModel<typeof employees> | null;
  };
  desiredShift: {
    shift: InferSelectModel<typeof schedules_day> | null | "time_off";
    date: string | null;
    employee: InferSelectModel<typeof employees> | null;
  };
};

export default function RowCalendarWithSwap({
  dataSingleScheduleDay,
  timeOffRequestsData,
  employeesTabFetched,
  employeeId,
  role,
  threeMonthScheduleDayAllFetched,
  setError,
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
  const [employeesWithSchedule, setEmployeesWithSchedule] =
    useState<EmployeeWithSchedule[]>();
  const date: Date = new Date();
  const pathname = usePathname();
  const CalenderFull: string[] = [];
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());
  const todayDate = date.toISOString().split("T")[0];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [showSwitchShiftsPanel, setShowSwitchShiftsPanel] =
    useState<boolean>(false);
  const [employeePick, setEmployeePick] = useState<number>(0);
  const [shiftSwap, setShiftSwap] = useState<ShiftSwapState>({
    offeredShift: { shift: null, date: null, employee: null },
    desiredShift: { shift: null, date: null, employee: null },
  });

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

  const selectOfferedShift = (
    shift: InferSelectModel<typeof schedules_day> | "time_off",
    day: string,
    clickedEmployee: InferSelectModel<typeof employees>,
  ) => {
    if (!showSwitchShiftsPanel) return;
    if (clickedEmployee.id !== Number(employeeId)) return;
    setShiftSwap((prev) => ({
      ...prev,
      offeredShift: {
        shift,
        date: day,
        employee: clickedEmployee,
      },
    }));
  };

  const selectDesiredShift = (
    shift: InferSelectModel<typeof schedules_day> | "time_off",
    day: string,
    clickedEmployee: InferSelectModel<typeof employees>,
  ) => {
    if (!showSwitchShiftsPanel) return;

    const {
      employee: offeringEmployee,
      date: offeringDate,
      shift: offeringShift,
    } = shiftSwap.offeredShift;

    if (!offeringEmployee || !offeringDate || !offeringShift) {
      setError("Please first choose a shift to give");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (offeringEmployee.id === clickedEmployee.id) {
      setError("Cannot exchange shift with yourself");
      setTimeout(() => setError(""), 2000);
      return;
    }

    const { CheckIfCantWork, getRemainingWeeklyHours } = useScheduleLogic({
      dataThreeMonthScheduleDayAllFetched: threeMonthScheduleDayAllFetched,
    });

    const getScheduledHours = (shiftObj: any): number => {
      if (!shiftObj || shiftObj === "time_off" || shiftObj === "timeOff")
        return 0;
      return shiftObj.scheduled_hours || 0;
    };

    const offeringShiftHours = getScheduledHours(offeringShift);
    const desiredShiftHours = getScheduledHours(shift);

    const offeringEmployeeCurrentRemaining = getRemainingWeeklyHours(
      Number(offeringEmployee.id),
      Number(offeringEmployee.contracted_hours_per_week),
      new Date(offeringDate),
    );

    const currentEmployeeCurrentRemaining = getRemainingWeeklyHours(
      Number(clickedEmployee.id),
      Number(clickedEmployee.contracted_hours_per_week),
      new Date(day),
    );

    const canOfferingEmployeeWork = !CheckIfCantWork(
      Number(offeringEmployee.max_consecutive_days),
      Number(offeringEmployee.id),
      new Date(day),
    );

    const canCurrentEmployeeWork = !CheckIfCantWork(
      Number(clickedEmployee.max_consecutive_days),
      Number(clickedEmployee.id),
      new Date(offeringDate),
    );

    // 2. Calculate the hourly BALANCE for each employee
    // DIFFERENCE = hours received - hours given away
    const offeringEmployeeHoursChange = desiredShiftHours - offeringShiftHours;
    const currentEmployeeHoursChange = offeringShiftHours - desiredShiftHours;

    // 3. Check if they will not exceed the contract after the exchange
    // NOTE: getRemainingWeeklyHours returns the NUMBER OF HOURS STILL TO BE ALLOCATED
    // If negative = already exceeded the contract

    // For the offeror: if they still have enough hours to allocate after the exchange
    const offeringEmployeeRemainingAfterSwap =
      offeringEmployeeCurrentRemaining - offeringEmployeeHoursChange;
    const canOfferingEmployeeTakeShift =
      offeringEmployeeRemainingAfterSwap >= 0;

    // For target: does it still have enough hours to allocate after the change
    const currentEmployeeRemainingAfterSwap =
      currentEmployeeCurrentRemaining - currentEmployeeHoursChange;
    const canCurrentEmployeeTakeShift = currentEmployeeRemainingAfterSwap >= 0;

    const canSwap =
      canOfferingEmployeeWork &&
      canCurrentEmployeeWork &&
      canOfferingEmployeeTakeShift &&
      canCurrentEmployeeTakeShift;

    if (!canSwap) {
      let errorMessage = "Exchange not possible: ";

      if (!canOfferingEmployeeWork)
        errorMessage += `${offeringEmployee.name} cannot work on ${day}`;
      if (!canCurrentEmployeeWork)
        errorMessage += `${clickedEmployee.name} cannot work on ${offeringDate}`;

      if (!canOfferingEmployeeTakeShift) {
        const change = offeringEmployeeHoursChange;
        if (change > 0) {
          errorMessage += `${offeringEmployee.name} would work ${Math.abs(change)}h more`;
        } else {
          errorMessage += `${offeringEmployee.name} scheduling conflict. `;
        }
      }

      if (!canCurrentEmployeeTakeShift) {
        const change = currentEmployeeHoursChange;
        if (change > 0) {
          errorMessage += `${clickedEmployee.name} would work ${Math.abs(change)}h more`;
        } else {
          errorMessage += `${clickedEmployee.name} scheduling conflict`;
        }
      }

      setError(errorMessage.trim());
      setTimeout(() => setError(""), 3500);
      return;
    }
    setShiftSwap((prev) => ({
      ...prev,
      desiredShift: {
        shift,
        date: day,
        employee: clickedEmployee,
      },
    }));

    setError(`Exchange possible!`);
    setTimeout(() => setError(""), 2000);
  };

  const removeSelectedShift = (day: string) => {
    setShiftSwap((prev) => {
      if (prev.offeredShift.date === day) {
        return {
          ...prev,
          offeredShift: { shift: null, date: null, employee: null },
        };
      } else if (prev.desiredShift.date === day) {
        return {
          ...prev,
          desiredShift: { shift: null, date: null, employee: null },
        };
      }
      return prev;
    });
  };

  useEffect(() => {
    if (!employeesTabFetched || !dataSingleScheduleDay) return;

    const mappedEmployees = employeesTabFetched.map((emp) => ({
      ...emp,
      schedule: dataSingleScheduleDay.filter(
        (el) => el.assigned_employee_id === emp.id,
      ),
    }));

    setEmployeesWithSchedule(mappedEmployees);
  }, [employeesTabFetched, dataSingleScheduleDay]);

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
            className="flex gap-2 w-[60vw] bg-teal-600 p-4 rounded-lg overflow-auto scrollbar-thin"
          >
            <div className="flex flex-col gap-2">
              <div
                className={`h-18 aspect-square p-4 rounded-lg flex justify-center items-center bg-transparent text-teal-600 hover:scale-105 transition ease-in-out `}
              />
              {employeesTabFetched.map((el, i) => (
                <Link
                  href={`${pathname}/${el.id}`}
                  key={el.user_id}
                  className={`h-18 aspect-square p-4 rounded-lg flex justify-center items-center  hover:scale-105 transition ease-in-out ${
                    employeeId === el.id.toString()
                      ? "bg-teal-600 text-white border-2"
                      : "bg-white text-teal-600"
                  } `}
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
                    {employeesWithSchedule?.map((emp) => {
                      const offered = shiftSwap.offeredShift;
                      const desired = shiftSwap.desiredShift;

                      const scheduleForDay = emp.schedule.find(
                        (scheduledDay) => {
                          const scheduledDate = new Date(scheduledDay.end_at)
                            .toISOString()
                            .split("T")[0];
                          return scheduledDate === day;
                        },
                      );

                      const timeOffForDay = timeOffRequestsData.find((el) => {
                        return (
                          el.date === day &&
                          el.employee_id === emp.id &&
                          el.status !== "declined"
                        );
                      });

                      const isSelectedForSwap =
                        (!!offered &&
                          offered.date === day &&
                          emp.id === offered.employee?.id) ||
                        (!!desired &&
                          desired.date === day &&
                          emp.id === desired.employee?.id);

                      const start = scheduleForDay
                        ? new Date(scheduleForDay.start_at).getHours()
                        : null;

                      const end = scheduleForDay
                        ? new Date(scheduleForDay.end_at).getHours()
                        : null;

                      const displayText = timeOffForDay
                        ? getInitials(timeOffForDay.type, "_")
                        : scheduleForDay
                          ? `${start} - ${end}`
                          : "-";

                      return (
                        <div
                          key={`emp-${emp.id}-day-${dayIndex}`}
                          onClick={() => {
                            employeePick === 0
                              ? selectOfferedShift(
                                  scheduleForDay || "time_off",
                                  day,
                                  emp,
                                )
                              : selectDesiredShift(
                                  scheduleForDay || "time_off",
                                  day,
                                  emp,
                                );
                          }}
                          onDoubleClick={() => removeSelectedShift(day)}
                          className={`cursor-pointer text-center aspect-square h-18 p-2 rounded-lg flex justify-center items-center text-teal-600 hover:scale-105 transition ease-in-out ${
                            employeeId === emp.id.toString()
                              ? "bg-teal-600 text-white border-2"
                              : timeOffForDay?.status === "waiting"
                                ? "bg-white text-teal-600 animate-pulse"
                                : day === date.toISOString().split("T")[0]
                                  ? "bg-teal-600 text-white border-2"
                                  : "bg-white text-teal-600"
                          } ${isSelectedForSwap ? "animate-pulse scale-105" : ""}`}
                        >
                          {displayText}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {showSwitchShiftsPanel && (
            <SchiftSwapExtension
              employeePick={employeePick}
              setEmployeePick={setEmployeePick}
              calendarHeight={calendarHeight}
              shiftSwap={shiftSwap}
              setError={setError}
              removeSelectedShift={removeSelectedShift}
            />
          )}
        </div>
        {role === "admin" && (
          <div className="mt-5">
            <PrimaryButton
              onClick={() => setShowSwitchShiftsPanel((prev) => !prev)}
            >
              Switch Shifts Panel
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
