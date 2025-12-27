import { EmployeeShift } from "@/app/manage/add/addSheduleDay/page";
import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React from "react";

type SheduleCardType = {
  fetchedShiftsData: EmployeeShift[];
  addShow: boolean;
  emp: InferSelectModel<typeof employees>;
  i: number;
};
export default function SheduleCard({
  fetchedShiftsData,
  addShow,
  emp,
  i,
}: SheduleCardType) {
  return (
    <div className="w-full p-5 border border-teal-600 rounded-lg">
      <h2 className="text-xl mb-5 m-2 text-center">
        {emp.name || "Unknown User"}
        <br />
        <span className="text-sm text-gray-400">{emp.email || "No email"}</span>
      </h2>
      <div className="flex justify-center items-center flex-col">
        {fetchedShiftsData[i]?.start_hour == null && !addShow ? (
          <p className="text-center text-teal-600 text-xl font-bold">
            deosnt work
          </p>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-center mb-2">Shift Start:</p>
              <p className="text-center text-teal-600 text-xl font-bold">
                {fetchedShiftsData[i]?.start_hour}:00
              </p>
            </div>

            <div>
              <p className="text-center mb-2">Shift End:</p>
              <p className="text-center text-teal-600 text-xl font-bold">
                {fetchedShiftsData[i]?.end_hour}:00
              </p>
            </div>

            {/* duration */}
            {fetchedShiftsData && (
              <div className="mt-4 p-2 rounded text-center">
                <p className="text-sm">
                  Duration:{" "}
                  <span className="font-bold text-teal-400">
                    {fetchedShiftsData[i]?.end_hour -
                      fetchedShiftsData[i]?.start_hour}
                    h
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
