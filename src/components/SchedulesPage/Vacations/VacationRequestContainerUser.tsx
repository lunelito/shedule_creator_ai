import React from "react";
import { InferSelectModel } from "drizzle-orm";
import { time_off_requests } from "@/db/schema";
import SingleVacationRequestItemUser from "./SingleVacationRequestItemUser";

type VacationRequestContainerType = {
  timeOffRequestsData: InferSelectModel<typeof time_off_requests>[];
};

export default function VacationRequestContainerUser({
  timeOffRequestsData,
}: VacationRequestContainerType) {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="relative w-[80vw] m-10 p-10 h-fit flex gap-5 flex-col border border-zinc-700 rounded-2xl">
        <h2 className="p-2 text-2xl font-bold mb-2">Vacation Requests:</h2>
        {timeOffRequestsData.length === 0 ? (
          <div className="p-10 w-full flex justify-center items-center border-white h-40 rounded-2xl">
            <p className="text-2xl font-bold ">No vacations request here!</p>
          </div>
        ) : (
          <div className="flex flex-col h-fit max-h-150 rounded-2xl overflow-y-auto scrollbar-none">
            {timeOffRequestsData
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
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
    </div>
  );
}
