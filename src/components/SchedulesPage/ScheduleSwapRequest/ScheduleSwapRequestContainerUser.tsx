import { scheduleSwapRequestsFetchedType } from "@/lib/hooks/useScheduleFetch";
import React from "react";
import SingleScheduleSwapRequestItemUser from "./SingleScheduleSwapRequestItemUser";
import { ParamValue } from "next/dist/server/request/params";

type ScheduleSwapRequestContainerUserType = {
  scheduleSwapRequestsFetched: scheduleSwapRequestsFetchedType[];
  employeeId: ParamValue;
};

export default function ScheduleSwapRequestContainerUser({
  scheduleSwapRequestsFetched,
  employeeId,
}: ScheduleSwapRequestContainerUserType) {
  const employeeScheduleSwapRequestsFetched =
    scheduleSwapRequestsFetched.filter(
      (el) => el.employeeRecive.id === Number(employeeId),
    );
  return (
    <div className="w-full flex justify-center items-center">
      <div className="relative w-[80vw] m-10 p-10 h-fit flex gap-5 flex-col border border-zinc-700 rounded-2xl">
        <h2 className="p-2 text-2xl font-bold mb-2">
          Schedule day swaps Requests:
        </h2>
        {employeeScheduleSwapRequestsFetched.length === 0 ? (
          <div className="p-10 w-full flex justify-center items-center  h-40 rounded-2xl">
            <p className="text-2xl font-bold ">
              No schedule day swaps request here!
            </p>
          </div>
        ) : (
          <div className="flex flex-col  h-fit max-h-200 rounded-2xl p-10 gap-5 overflow-y-auto scrollbar-none">
            {employeeScheduleSwapRequestsFetched
              .sort(
                (a, b) =>
                  new Date(b.scheduleSwapRequest.created_at).getTime() -
                  new Date(a.scheduleSwapRequest.created_at).getTime(),
              )
              .map((scheduleSwapDay) => (
                <SingleScheduleSwapRequestItemUser
                  key={scheduleSwapDay.scheduleSwapRequest.id}
                  scheduleSwapDay={scheduleSwapDay}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
