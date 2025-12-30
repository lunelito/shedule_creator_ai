import React, { SetStateAction } from "react";
import NumberPicker from "../UI/NumberPicker";
import { EmployeeShift } from "@/app/manage/add/addSheduleDay/page";
import { InferSelectModel } from "drizzle-orm";
import { employees } from "@/db/schema";
import PrimaryButton from "../UI/PrimaryButton";

type AddSheduleCardType = {
  emp: InferSelectModel<typeof employees>;
  employeeShifts: EmployeeShift[];
  employeeShift: EmployeeShift | undefined;
  setEmployeeShifts: React.Dispatch<SetStateAction<EmployeeShift[]>>;
};

export default function AddSheduleCard({
  emp,
  employeeShifts,
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

  const toggleSelect = (employeeId: number) => {
    if (employeeShift) {
      const selectedCount = employeeShifts.filter((el) => el.selected).length;

      const clicedSelectValue = employeeShifts
        .map((el) => (el.employee_id === employeeId ? { ...el } : null))
        .filter((el) => el !== null)[0].selected;

      if (selectedCount < 1 || clicedSelectValue) {
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
      className={`w-full p-5 border border-teal-600 rounded-lg ${
        employeeShift?.selected ? "opacity-50" : ""
      } transition-all ease-in-out`}
    >
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
              disabled={employeeShift?.selected}
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
              disabled={employeeShift?.selected}
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
            <PrimaryButton
              onClick={() => toggleSelect(employeeShift?.employee_id)}
            >
              {employeeShift?.selected ? "dodaj z edycji" : "usun do edycjiu"}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
