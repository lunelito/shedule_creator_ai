import React, { SetStateAction } from "react";
import NumberPicker from "../UI/NumberPicker";
import {
  EmployeeShift,
  ShiftFetched,
} from "@/app/manage/add/addSheduleDay/page";
import { InferSelectModel } from "drizzle-orm";
import { employees } from "@/db/schema";
import { deleteSingleScheduleDay } from "@/lib/actions/Schedule/deleteSingleScheduleDay";
import PrimaryButton from "../UI/PrimaryButton";

type AddSheduleCardType = {
  fetchedShift: ShiftFetched | undefined;
  addShow: boolean;
  emp: InferSelectModel<typeof employees>;
  i: number;
  setEditleShow: React.Dispatch<React.SetStateAction<boolean>>;
  editShift: ShiftFetched | undefined;
  setEditFetchedShiftsData: React.Dispatch<SetStateAction<ShiftFetched[]>>;
  setError: React.Dispatch<SetStateAction<string>>;
  setFetchedShiftsData: React.Dispatch<SetStateAction<ShiftFetched[]>>;
  editFetchedShiftsData: ShiftFetched[];
};

export default function EditScheduleCard({
  fetchedShift,
  addShow,
  emp,
  i,
  editShift,
  setEditleShow,
  setError,
  setFetchedShiftsData,
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

  const deleteDay = async (id: number) => {
    try {
      if (fetchedShift) {
        const result = await deleteSingleScheduleDay(id);

        if (result.success) {
          setError(result.errors?._form?.[0] ?? "");
          setFetchedShiftsData((prev) => prev.filter((el) => el.id !== id));
          setEditFetchedShiftsData((prev) => prev.filter((el) => el.id !== id));
        }

        setTimeout(() => {
          setError(""), setEditleShow(false);
        }, 2000);
      }
    } catch (e: any) {
      setError(e?.message ?? "server error");
    }
  };

  return (
    <div
      className={`w-full p-5 border border-teal-600 rounded-lg ${
        editShift?.start_hour == null ? "opacity-50" : ""
      }`}
    >
      <div className="flex flex-col justify-center items-center gap-3 mb-5">
        <h2 className="text-xl">
          {emp.name || "Unknown User"}
          <br />
        </h2>
        <p className="text-sm text-gray-400">{emp.email || "No email"}</p>
        {editShift?.start_hour != null ? (
          <p className="text-sm font-bold">
            currently working from{" "}
            <span className="text-teal-500">
              {/* a tu normalnie jest wartosc XD? */}
              {editShift?.start_hour}
            </span>{" "}
            to <span className="text-teal-500">{editShift?.end_hour}</span>
          </p>
        ) : (
          <p className="text-sm font-bold">deosnt work</p>
        )}
      </div>
      <div className="flex justify-center items-center flex-col">
        <>
          <div className="mb-4">
            <div>
              <p className="text-center mb-2">Shift Start:</p>
              <NumberPicker
                disabled={editShift?.start_hour == null}
                from={0}
                to={Math.min(
                  editShift?.end_hour ?? 24,
                  (editShift?.start_hour ?? 0) + 12
                )}
                orientation="horizontal"
                title=""
                rangeDefault={editShift?.start_hour ?? 8}
                onChange={(value) => handleTimeChange(emp.id, "start", value)}
              />
              <p className="text-center mb-2">Shift End:</p>
              <NumberPicker
                disabled={editShift?.start_hour == null}
                from={editShift ? Math.max(0, editShift?.start_hour) : 0}
                to={editShift ? Math.min(24, editShift?.start_hour + 12) : 24}
                orientation="horizontal"
                title=""
                rangeDefault={editShift?.end_hour ?? 16}
                onChange={(value) => handleTimeChange(emp.id, "end", value)}
              />
            </div>
          </div>
          {editShift && (
            <div className="mt-4 p-2 rounded text-center">
              <p className="text-sm">
                Duration:{" "}
                <span className="font-bold text-teal-400">
                  {editShift?.end_hour - editShift?.start_hour}h
                </span>
              </p>
              {fetchedShift?.id && (
                <PrimaryButton onClick={() => deleteDay(fetchedShift.id)}>
                  delete
                </PrimaryButton>
              )}
            </div>
          )}
        </>
      </div>
    </div>
  );
}
