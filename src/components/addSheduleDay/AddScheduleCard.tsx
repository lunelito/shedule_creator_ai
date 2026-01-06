import React, {
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NumberPicker from "../UI/NumberPicker";
import {
  EmployeeShift,
  ShiftFetched,
} from "@/app/manage/add/addSheduleDay/page";
import { InferSelectModel } from "drizzle-orm";
import { employees, schedules_day } from "@/db/schema";
import PrimaryButton from "../UI/PrimaryButton";
import Image from "next/image";

type AddSheduleCardType = {
  emp: InferSelectModel<typeof employees>;
  employeeShifts: EmployeeShift[];
  employeeShift: EmployeeShift;
  fetchedShiftsData: ShiftFetched[];
  setEmployeeShifts: React.Dispatch<SetStateAction<EmployeeShift[]>>;
  dataThreeMonthScheduleDayAllFetched: InferSelectModel<
    typeof schedules_day
  >[][];
  setDataThreeMonthScheduleDayAllFetched: React.Dispatch<
    SetStateAction<InferSelectModel<typeof schedules_day>[][]>
  >;
  selectedDate: Date;
};

export default function AddSheduleCard({
  emp,
  employeeShifts,
  fetchedShiftsData,
  employeeShift,
  setEmployeeShifts,
  dataThreeMonthScheduleDayAllFetched,
  selectedDate,
}: AddSheduleCardType) {
  const expendDisabled = employeeShift.remainingWeeklyHours <= 0;
  const handleTimeChange = (
    employeeId: number,
    type: "start" | "end",
    hour: number
  ) => {
    setEmployeeShifts((prev) => {
      return prev.map((s) => {
        if (s.employee_id !== employeeId) return s;

        const start = type === "start" ? hour : s.start_hour;
        const end = type === "end" ? hour : s.end_hour;

        const prevDiff = s.end_hour - s.start_hour;
        const newDiff = end - start;
        const diffChange = newDiff - prevDiff;
        console.log(diffChange);

        if (
          hour < 0 ||
          hour > 23 ||
          newDiff < 0 ||
          newDiff > 12 ||
          s.remainingWeeklyHours - diffChange < 0
        ) {
          return s;
        }

        return {
          ...s,
          start_hour: start,
          end_hour: end,
          remainingWeeklyHours: s.remainingWeeklyHours - diffChange,
        };
      });
    });
  };

  const toggleSelect = (employeeId: number) => {
    if (employeeShift) {
      const selectedCount = employeeShifts.filter((el) => !el.selected).length;

      const clicedSelectValue = employeeShifts
        .map((el) => (el.employee_id === employeeId ? { ...el } : null))
        .filter((el) => el !== null)[0].selected;

      if (selectedCount - fetchedShiftsData.length > 1 || clicedSelectValue) {
        setEmployeeShifts((prev) =>
          prev.map((el) =>
            el.employee_id === employeeId
              ? { ...el, selected: !el.selected }
              : el
          )
        );
      }
    }
  };

  return (
    <div
      className={`w-full p-5 border border-teal-600 rounded-lg select-none relative transition-all ease-in-out ${
        employeeShift?.selected ? "opacity-50" : ""
      }`}
    >
      <h2 className="text-xl mb-5 m-2 text-center">
        {emp.name || "Unknown User"}
        <br />
        <span className="text-sm text-gray-400">{emp.email || "No email"}</span>
      </h2>

      <div className="flex flex-col items-center">
        <div className="mb-4">
          <p className="text-center mb-2">Shift Start:</p>
          <NumberPicker
            disabled={employeeShift?.selected}
            expendDisabled={expendDisabled}
            expendSide={"L"}
            from={0}
            to={23}
            orientation="horizontal"
            title=""
            rangeDefault={employeeShift?.start_hour || 0}
            onChange={(value) => handleTimeChange(emp.id, "start", value)}
          />

          <p className="text-center mb-2">Shift End:</p>
          <NumberPicker
            expendSide={"R"}
            disabled={employeeShift?.selected}
            expendDisabled={expendDisabled}
            from={0}
            to={23}
            orientation="horizontal"
            title=""
            rangeDefault={employeeShift?.end_hour || 0}
            onChange={(value) => handleTimeChange(emp.id, "end", value)}
          />

          {employeeShift && (
            <div className="mt-4 p-2 rounded text-center">
              <p className="text-sm">
                Duration:{" "}
                <span className="font-bold text-teal-400">
                  {employeeShift.end_hour - employeeShift.start_hour}h
                </span>
              </p>
              <p className="text-sm">
                Remaning Hours this Week:{" "}
                <span className="font-bold text-teal-400">
                  {employeeShift.remainingWeeklyHours}h
                </span>
              </p>
            </div>
          )}
          <div className="absolute -top-4 -left-4">
            <button
              onClick={() => toggleSelect(employeeShift?.employee_id)}
              className="relative bg-teal-600 h-8 w-8 rounded-full flex items-center justify-center"
            >
              <Image
                src={`/Icons/${
                  employeeShift?.selected ? "addIcon" : "minus"
                }.svg`}
                alt="cross"
                fill
                style={{ objectFit: "contain" }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
