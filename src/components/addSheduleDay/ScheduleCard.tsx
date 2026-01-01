import { ShiftFetched } from "@/app/manage/add/addSheduleDay/page";
import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { SetStateAction } from "react";
import PrimaryButton from "../UI/PrimaryButton";
import { deleteSingleScheduleDay } from "@/lib/actions/Schedule/deleteSingleScheduleDay";

type SheduleCardType = {
  fetchedShift: ShiftFetched | undefined;
  addShow: boolean;
  emp: InferSelectModel<typeof employees>;
};
export default function SheduleCard({
  fetchedShift,
  addShow,
  emp,
}: SheduleCardType) {
  return (
    <div className="w-full p-5 border border-teal-600 rounded-lg">
      <h2 className="text-xl mb-5 m-2 text-center">
        {emp.name || "Unknown User"}
        <br />
        <span className="text-sm text-gray-400">{emp.email || "No email"}</span>
      </h2>
      <div className="flex justify-center items-center flex-col">
        {fetchedShift?.start_hour == null && !addShow ? (
          <p className="text-center text-teal-600 text-xl font-bold">
            deosnt work
          </p>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-center mb-2">Shift Start:</p>
              <p className="text-center text-teal-600 text-xl font-bold">
                {fetchedShift?.start_hour}:00
              </p>
            </div>

            <div>
              <p className="text-center mb-2">Shift End:</p>
              <p className="text-center text-teal-600 text-xl font-bold">
                {fetchedShift?.end_hour}:00
              </p>
            </div>

            {/* duration */}
            {fetchedShift && (
              <div className="mt-4 p-2 rounded text-center">
                <p className="text-sm">
                  Duration:{" "}
                  <span className="font-bold text-teal-400">
                    {fetchedShift?.end_hour - fetchedShift?.start_hour}h
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
