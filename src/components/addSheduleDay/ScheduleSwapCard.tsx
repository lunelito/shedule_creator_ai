import { employees, time_off_requests } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { SetStateAction } from "react";

type SheduleCardType = {
  emp: InferSelectModel<typeof employees>;
};

export default function ScheduleSwapCard({
  emp,
}: SheduleCardType) {
  return (
    <div className="w-full p-5 border border-teal-600 rounded-lg">
      <h2 className="text-xl mb-5 m-2 text-center">
        {emp.name || "Unknown User"} - {emp.id}
        <br />
        <span className="text-sm text-gray-400">{emp.email || "No email"}</span>
      </h2>
      <div className="flex justify-center items-center flex-col">
        <p className="text-center text-teal-600 text-xl font-bold">
          is waiting for a schedule day swap
        </p>
      </div>
    </div>
  );
}
