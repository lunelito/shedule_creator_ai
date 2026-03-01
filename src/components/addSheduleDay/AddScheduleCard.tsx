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
import DeleteIcon from "../UI/DeleteIcon";

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

  const calculateDuration = (start: number, end: number) => {
    if (end >= start) {
      return end - start;
    } else {
      return 24 - start + end;
    }
  };

  const handleTimeChange = (
    employeeId: number,
    type: "start" | "end",
    hour: number
  ) => {
    setEmployeeShifts((prev) => {
      return prev.map((s) => {
        if (s.employee_id !== employeeId) return s;

        let newStart = s.start_hour;
        let newEnd = s.end_hour;

        if (type === "start") {
          newStart = hour;
        } else {
          newEnd = hour;
        }

        const newDuration = calculateDuration(newStart, newEnd);

        if (newDuration < 1) {
          if (type === "start") {
            newEnd = (newStart + 1) % 24;
          } else {
            newStart = (newEnd - 1 + 24) % 24;
          }
        }

        let finalDuration = calculateDuration(newStart, newEnd);
        if (finalDuration > 12) {
          if (type === "start") {
            newEnd = (newStart + 12) % 24;
          } else {
            newStart = (newEnd - 12 + 24) % 24;
          }
          finalDuration = 12;
        }

        const prevDuration = calculateDuration(s.start_hour, s.end_hour);
        const durationChange = finalDuration - prevDuration;

        if (durationChange > 0 && s.remainingWeeklyHours - durationChange < 0) {
          return s;
        }
        const newRemainingWeeklyHours = Math.max(
          0,
          s.remainingWeeklyHours - durationChange
        );

        return {
          ...s,
          start_hour: newStart,
          end_hour: newEnd,
          remainingWeeklyHours: newRemainingWeeklyHours,
        };
      });
    });
  };

  const getStartLimits = () => {
    const currentDuration = calculateDuration(
      employeeShift.start_hour,
      employeeShift.end_hour
    );

    const canDecreaseStart =
      employeeShift.start_hour > 0 && employeeShift.remainingWeeklyHours > 0;

    const canIncreaseStart = currentDuration < 12;

    return { canDecreaseStart, canIncreaseStart };
  };

  const getEndLimits = () => {
    const currentDuration = calculateDuration(
      employeeShift.start_hour,
      employeeShift.end_hour
    );

    const canDecreaseEnd = currentDuration > 1;

    const canIncreaseEnd =
      currentDuration < 12 && employeeShift.remainingWeeklyHours > 0;

    return { canDecreaseEnd, canIncreaseEnd };
  };

  const startLimits = getStartLimits();
  const endLimits = getEndLimits();

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
          <NumberPicker
            disabled={employeeShift.selected}
            disabledLeft={!startLimits.canDecreaseStart}
            disabledRight={!startLimits.canIncreaseStart}
            expendDisabled={expendDisabled}
            expendSide={"L"}
            from={0}
            to={24}
            canDBclick={false}
            orientation="horizontal"
            title="Shift Start:"
            rangeDefault={employeeShift.start_hour}
            onChange={(value) => handleTimeChange(emp.id, "start", value)}
          />

          <NumberPicker
            expendSide={"R"}
            disabled={employeeShift.selected}
            disabledLeft={!endLimits.canDecreaseEnd}
            disabledRight={!endLimits.canIncreaseEnd}
            expendDisabled={expendDisabled}
            from={0}
            canDBclick={false}
            to={24}
            orientation="horizontal"
            title="Shift End:"
            rangeDefault={employeeShift.end_hour}
            onChange={(value) => handleTimeChange(emp.id, "end", value)}
          />

          {employeeShift && (
            <div className="mt-4 p-2 rounded text-center">
              <p className="text-sm">
                Duration:{" "}
                <span className={`font-bold text-teal-500`}>
                  {calculateDuration(
                    employeeShift.start_hour,
                    employeeShift.end_hour
                  )}
                  h
                </span>
              </p>
              <p className="text-sm">
                Remaining Hours this Week:{" "}
                <span className={`font-bold text-teal-500`}>
                  {employeeShift.remainingWeeklyHours}h
                </span>
              </p>
            </div>
          )}
          <DeleteIcon
            onClick={() => toggleSelect(employeeShift?.employee_id)}
            path={`/Icons/${employeeShift?.selected ? "addIcon" : "minus"}.svg`}
            bgColor={"bg-teal-600"}
            size="M"
          />
        </div>
      </div>
    </div>
  );
}
