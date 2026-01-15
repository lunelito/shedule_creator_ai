import React, { useState } from "react";
import { vacationDataType } from "../SchedulesPage/VacationRequestContainerAdmin";
import { AnimatePresence } from "framer-motion";
import AnimatedDetailOnClick from "@/animations/AnimatedDetailOnClick";
import Input from "../UI/Input";
import { time_off_requests } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type SingleVacationRequestItemType = {
  timeOffRequest: InferSelectModel<typeof time_off_requests>;
};

export default function SingleVacationRequestItemUser({
  timeOffRequest,
}: SingleVacationRequestItemType) {
  const formatedData = (baseDate: Date) => {
    const date = new Date(baseDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="w-full rounded-2xl bg-zinc-900 p-[clamp(1rem,2vw,1rem)] text-white transition hover:border-teal-500">
      <div className="flex flex-col">
        <div
          key={timeOffRequest.date}
          className={`${
            timeOffRequest.status === "declined" ? "opacity-50" : ""
          } grid grid-cols-1 gap-[clamp(0.5rem,1.5vw,1rem)] rounded-xl bg-zinc-800 p-[clamp(0.75rem,2vw,1.25rem)] md:grid-cols-6 md:items-center justify-center`}
        >
          <div className="text-[clamp(0.85rem,1.6vw,1rem)] font-medium">
            {timeOffRequest.date}
          </div>

          <div className="text-[clamp(0.8rem,1.4vw,0.95rem)] text-zinc-300">
            {timeOffRequest.is_scheduled ? (
              <>
                Scheduled{" "}
                <span className="font-semibold text-white">
                  {timeOffRequest.hours_scheduled}h
                </span>
              </>
            ) : (
              <span className="italic text-zinc-400">Not scheduled</span>
            )}
          </div>

          <div>
            <span className="rounded-full bg-teal-600/20 px-3 py-1 text-[clamp(0.65rem,1.2vw,0.75rem)] font-semibold text-teal-400">
              {timeOffRequest.type}
            </span>
          </div>

          <div className="text-[clamp(0.8rem,1.4vw,0.95rem)] text-center text-zinc-300">
            {timeOffRequest.reason || (
              <span className="italic text-zinc-500">No reason</span>
            )}
          </div>

          <div className="text-[clamp(0.8rem,1.4vw,0.95rem)] text-center text-zinc-300">
            {timeOffRequest.rejection_reason || (
              <span className="italic text-zinc-500">No rejection reason</span>
            )}
          </div>
          <div>
            <span
              className={`rounded-full px-3 py-1 text-[clamp(0.65rem,1.2vw,0.75rem)] font-semibold ${
                timeOffRequest.status === "accepted"
                  ? "bg-teal-600/20 text-teal-600"
                  : timeOffRequest.status === "waiting"
                  ? "bg-teal-600/20 text-teal-600 animate-pulse"
                  : "bg-red-600/20 text-red-600"
              }
`}
            >
              {timeOffRequest.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
