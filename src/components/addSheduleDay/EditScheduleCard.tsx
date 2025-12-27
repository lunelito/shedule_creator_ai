import React, { SetStateAction } from "react";
import NumberPicker from "../UI/NumberPicker";
import {
  EmployeeShift,
  ShiftFetched,
} from "@/app/manage/add/addSheduleDay/page";
import { InferSelectModel } from "drizzle-orm";
import { employees } from "@/db/schema";

type AddSheduleCardType = {
  fetchedShiftsData: EmployeeShift[];
  addShow: boolean;
  emp: InferSelectModel<typeof employees>;
  i: number;
  editFetchedShiftsData: ShiftFetched[] | undefined;
  setEditFetchedShiftsData: React.Dispatch<SetStateAction<ShiftFetched[]>>;
};

export default function EditScheduleCard({
  fetchedShiftsData,
  addShow,
  emp,
  i,
  editFetchedShiftsData,
  setEditFetchedShiftsData,
}: AddSheduleCardType) {
  const handleTimeChange = (
    employeeId: number,
    type: "start" | "end",
    hour: number
  ) => {
    setEditFetchedShiftsData((prev) => {
      return prev.map((s) => {
        if (s.employee_id !== employeeId) return s;

        const newStart = type === "start" ? hour : s.start_hour;
        const newEnd = type === "end" ? hour : s.end_hour;

        const diff = newEnd - newStart;

        if (hour < 0 || hour > 24 || diff < 0 || diff > 12) {
          return s;
        }

        return {
          ...s,
          start_hour: newStart,
          end_hour: newEnd,
        };
      });
    });
  };

  return (
    <div className="w-full p-5 border border-teal-600 rounded-lg">
      <div className="flex flex-col justify-center items-center gap-3 mb-5">
        <h2 className="text-xl">
          {emp.name || "Unknown User"}
          <br />
        </h2>
        <p className="text-sm text-gray-400">{emp.email || "No email"}</p>
        <p className="text-sm font-bold">
          currently working from{" "}
          <span className="text-teal-500">
            {fetchedShiftsData[i]?.start_hour}
          </span>{" "}
          to{" "}
          <span className="text-teal-500">
            {fetchedShiftsData[i]?.end_hour}
          </span>
        </p>
      </div>
      <div className="flex justify-center items-center flex-col">
        <div className="mb-4">
          <div>
            <p className="text-center mb-2">Shift Start:</p>
            <NumberPicker
              from={0}
              to={Math.min(
                editFetchedShiftsData?.[i]?.end_hour ?? 24,
                (editFetchedShiftsData?.[i]?.start_hour ?? 0) + 12
              )}
              orientation="horizontal"
              title=""
              rangeDefault={editFetchedShiftsData?.[i]?.start_hour ?? 8}
              onChange={(value) => handleTimeChange(emp.id, "start", value)}
            />
            <p className="text-center mb-2">Shift End:</p>
            <NumberPicker
              from={
                editFetchedShiftsData
                  ? Math.max(0, editFetchedShiftsData[i]?.start_hour)
                  : 0
              }
              to={
                editFetchedShiftsData
                  ? Math.min(24, editFetchedShiftsData[i]?.start_hour + 12)
                  : 24
              }
              orientation="horizontal"
              title=""
              rangeDefault={editFetchedShiftsData?.[i]?.end_hour ?? 16}
              onChange={(value) => handleTimeChange(emp.id, "end", value)}
            />
          </div>
        </div>

        {editFetchedShiftsData && (
          <div className="mt-4 p-2 rounded text-center">
            <p className="text-sm">
              Duration:{" "}
              <span className="font-bold text-teal-400">
                {editFetchedShiftsData[i]?.end_hour -
                  editFetchedShiftsData[i]?.start_hour}
                h
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
