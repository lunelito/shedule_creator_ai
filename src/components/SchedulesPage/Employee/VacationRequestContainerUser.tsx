import React, { SetStateAction, useEffect, useState } from "react";
import { ParamValue } from "next/dist/server/request/params";
import { InferSelectModel } from "drizzle-orm";
import { employees, time_off_requests } from "@/db/schema";
import SingleVacationRequestItem from "../../inbox/SingleVacationRequestItemAdmin";
import { editVacation } from "@/lib/actions/Schedule/editVacation";
import { deleteSchedule } from "@/lib/actions/Schedule/deleteShedule";
import { deleteSingleScheduleDay } from "@/lib/actions/Schedule/deleteSingleScheduleDay";
import SingleVacationRequestItemUser from "@/components/inbox/SingleVacationRequestItemUser";

type VacationRequestContainerType = {
  timeOffRequestsData: InferSelectModel<typeof time_off_requests>[];
};


export default function VacationRequestContainerUser({
  timeOffRequestsData,
}: VacationRequestContainerType) {
    console.log(timeOffRequestsData)
  return (
    <div className="relative w-[80vw] m-10 p-10 h-fit flex gap-5 flex-col border border-zinc-700 rounded-2xl">
      <h2 className="p-2 text-2xl font-bold mb-2">Vacation Requests:</h2>
      {timeOffRequestsData.length === 0 ? (
        <div className="p-10 w-full flex justify-center items-center border-white border-1 h-40 rounded-2xl">
          <p className="text-2xl font-bold ">No vacations request here!</p>
        </div>
      ) : (
        <div className="flex flex-col h-fit max-h-150 rounded-2xl overflow-y-auto scrollbar-none">
          {timeOffRequestsData
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((el, i) => (
              <SingleVacationRequestItemUser
                key={el.id}
                timeOffRequest={el}
              />
            ))}
        </div>
      )}
    </div>
  );
}
