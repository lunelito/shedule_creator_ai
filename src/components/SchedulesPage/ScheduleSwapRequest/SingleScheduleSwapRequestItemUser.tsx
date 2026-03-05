import { scheduleSwapRequestsFetchedType } from "@/lib/hooks/useScheduleFetch";
import React from "react";

type SingleScheduleSwapRequestItemAdminType = {
  scheduleSwapDay: scheduleSwapRequestsFetchedType;
};

export default function SingleScheduleSwapRequestItemUser({
  scheduleSwapDay,
}: SingleScheduleSwapRequestItemAdminType) {
  const formatedData = (baseDate: Date) => {
    const date = new Date(baseDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getHours = (baseDate: Date) => {
    const date = new Date(baseDate);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const {
    employeeRecive,
    employeeRequest,
    scheduleDayRecive,
    scheduleDayRequest,
    scheduleSwapRequest,
  } = scheduleSwapDay;

  return (
    <div className="w-full rounded-2xl bg-zinc-900 p-[clamp(1rem,2vw,1.5rem)] text-white transition hover:border-teal-500">
      {/* Header */}
      <div className="mb-[clamp(0.75rem,2vw,1.5rem)] flex items-start justify-between gap-4">
        <p className="max-w-[70%] text-[clamp(1rem,1.5vw,1.5rem)] font-semibold leading-tight">
          {employeeRecive.name?.split(" ")[0]}
          <span className="ml-2 text-[clamp(0.75rem,1.5vw,0.95rem)] text-zinc-400">
            wants to swap schedule day with{" "}
          </span>
          {employeeRequest.name?.split(" ")[0]}
        </p>

        <p className="whitespace-nowrap text-[clamp(0.7rem,1.4vw,0.9rem)] text-zinc-400">
          {formatedData(scheduleSwapRequest.created_at)}
        </p>
      </div>

      <div
        className={`${
          scheduleSwapRequest.status === "declined" ? "opacity-50" : ""
        } h-fit flex w-full rounded-xl bg-zinc-800 p-[clamp(0.75rem,2vw,1.25rem)] md:grid-cols-5 md:items-center justify-center`}
      >
        {/* recive */}
        <div className="flex w-1/4 flex-col items-start gap-1">
          <p className="text-sm font-semibold text-white">
            {employeeRecive?.name?.split(" ")[0] ?? (
              <span className="italic text-zinc-500">Unknown</span>
            )}
          </p>

          <div className="text-[clamp(0.8rem,1.4vw,0.95rem)] text-zinc-300">
            {scheduleDayRecive ? (
              <>
                <p>
                  {getHours(scheduleDayRecive.start_at)} –{" "}
                  {getHours(scheduleDayRecive.end_at)}
                </p>
                <p>
                  Scheduled{" "}
                  <span className="font-semibold text-white">
                    {scheduleDayRecive.scheduled_hours}h
                  </span>
                </p>
                <p>
                  {scheduleSwapRequest.date_recive !== null
                    ? formatedData(scheduleSwapRequest.date_recive)
                    : "-"}
                </p>
              </>
            ) : (
              <>
                <span className="italic text-zinc-500">Not scheduled</span>
                <p>
                  {scheduleSwapRequest.date_recive !== null
                    ? formatedData(scheduleSwapRequest.date_recive)
                    : "-"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* request */}
        <div className="flex w-1/4 flex-col items-start gap-1">
          <p className="text-sm font-semibold text-white">
            {employeeRequest?.name?.split(" ")[0] ?? (
              <span className="italic text-zinc-500">Unknown</span>
            )}
          </p>

          <div className="text-[clamp(0.8rem,1.4vw,0.95rem)] text-zinc-300">
            {scheduleDayRequest ? (
              <>
                <p>
                  {getHours(scheduleDayRequest.start_at)} –{" "}
                  {getHours(scheduleDayRequest.end_at)}
                </p>
                <p>
                  Scheduled{" "}
                  <span className="font-semibold text-white">
                    {scheduleDayRequest.scheduled_hours}h
                  </span>
                </p>
                <p>
                  {scheduleSwapRequest.date_request !== null
                    ? formatedData(scheduleSwapRequest.date_request)
                    : "-"}
                </p>
              </>
            ) : (
              <>
                <span className="italic text-zinc-500">Not scheduled</span>
                <p>
                  {scheduleSwapRequest.date_request !== null
                    ? formatedData(scheduleSwapRequest.date_request)
                    : "-"}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="w-1/4">
          <span className="text-[clamp(0.8rem,1.4vw,0.95rem)] text-zinc-300">
            {scheduleSwapRequest.rejection_reason || "no reject reasion"}
          </span>
        </div>
        <div>
          <span
            className={`rounded-full  px-3 py-1 text-[clamp(0.65rem,1.2vw,0.75rem)] font-semibold ${
              scheduleSwapRequest.status === "accepted"
                ? "bg-teal-600/20 text-teal-600"
                : scheduleSwapRequest.status === "waiting"
                  ? "bg-zinc-600/20 text-zinc-600"
                  : " bg-red-600/20 text-red-600"
            }`}
          >
            {scheduleSwapRequest.status}
          </span>
        </div>
      </div>
    </div>
  );
}
