import React, { SetStateAction } from "react";
import NumberPicker from "../UI/NumberPicker";
import { EmployeeShift } from "@/app/manage/add/addSheduleDay/page";
import { InferSelectModel } from "drizzle-orm";
import { employees } from "@/db/schema";

type AddSheduleCardType = {
  fetchedShiftsData: EmployeeShift[];
  addShow: boolean;
  emp: InferSelectModel<typeof employees>;
  i: number;
  employeeShift: EmployeeShift | undefined;
  setEmployeeShifts: React.Dispatch<SetStateAction<EmployeeShift[]>>;
};

export default function AddSheduleCard({
  fetchedShiftsData,
  addShow,
  emp,
  i,
  employeeShift,
  setEmployeeShifts,
}: AddSheduleCardType) {
  const handleTimeChange = (
    employeeId: number,
    type: "start" | "end",
    hour: number
  ) => {
    setEmployeeShifts((prev) => {
      const shift = prev.find((s) => s.employee_id === employeeId);
      if (!shift) return prev;

      const start = type === "start" ? hour : shift.start_hour;
      const end = type === "end" ? hour : shift.end_hour;

      const diff = end - start;

      if (hour < 0 || hour > 24 || diff > 12 || diff < 0) {
        return prev;
      }

      return prev.map((s) =>
        s.employee_id === employeeId
          ? {
              ...s,
              [type === "start" ? "start_hour" : "end_hour"]: hour,
            }
          : s
      );
    });
  };

  return (
    <div className="w-full p-5 border border-teal-600 rounded-lg">
      <h2 className="text-xl mb-5 m-2 text-center">
        {emp.name || "Unknown User"}
        <br />
        <span className="text-sm text-gray-400">{emp.email || "No email"}</span>
      </h2>
      <div className="flex justify-center items-center flex-col">
        <div className="mb-4">
          <div>
            <p className="text-center mb-2">Shift Start:</p>
            <NumberPicker
              from={0}
              to={
                employeeShift
                  ? Math.min(
                      employeeShift.end_hour,
                      employeeShift.start_hour + 12
                    )
                  : 24
              }
              orientation="horizontal"
              title=""
              rangeDefault={employeeShift?.start_hour || 8}
              onChange={(value) => handleTimeChange(emp.id, "start", value)}
            />
            <p className="text-center mb-2">Shift End:</p>
            <NumberPicker
              from={employeeShift ? Math.max(0, employeeShift.start_hour) : 0}
              to={
                employeeShift ? Math.min(24, employeeShift.start_hour + 12) : 24
              }
              orientation="horizontal"
              title=""
              rangeDefault={employeeShift?.end_hour || 16}
              onChange={(value) => handleTimeChange(emp.id, "end", value)}
            />
          </div>
        </div>

        {employeeShift && (
          <div className="mt-4 p-2 rounded text-center">
            <p className="text-sm">
              Duration:{" "}
              <span className="font-bold text-teal-400">
                {employeeShift?.end_hour - employeeShift?.start_hour}h
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
