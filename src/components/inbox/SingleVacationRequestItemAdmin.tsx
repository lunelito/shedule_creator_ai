import React, { useState } from "react";
import { vacationDataType } from "../SchedulesPage/VacationRequestContainerAdmin";
import { AnimatePresence } from "framer-motion";
import AnimatedDetailOnClick from "@/animations/AnimatedDetailOnClick";
import Input from "../UI/Input";

type SingleVacationRequestItemType = {
  empVacationRequest: vacationDataType;
  changeDecision: (
    decision: string,
    vacationId: number,
    empId: number,
    scheduleId: number,
    schedule_day_id: number | null,
    reasonReject?: string | undefined
  ) => Promise<void>;
};

export default function SingleVacationRequestItemAdmin({
  empVacationRequest,
  changeDecision,
}: SingleVacationRequestItemType) {
  const formatedData = (baseDate: Date) => {
    const date = new Date(baseDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [reasonRejectValue, setReasonRejectValue] = useState<string>("");

  const [currentVacation, setCurrentVacation] = useState<{
    id: number;
    employee_id: number;
    schedule_id: number;
    schedule_day_id: number | null;
  } | null>(null);

  return (
    <div className="w-full rounded-2xl bg-zinc-900 p-[clamp(1rem,2vw,1.5rem)] text-white transition hover:border-teal-500">
      {/* Header */}
      <div className="mb-[clamp(0.75rem,2vw,1.5rem)] flex items-start justify-between gap-4">
        <p className="max-w-[70%] text-[clamp(1rem,1.5vw,1.5rem)] font-semibold leading-tight">
          {empVacationRequest.email}
          <span className="ml-2 text-[clamp(0.75rem,1.5vw,0.95rem)] text-zinc-400">
            requested time off
          </span>
        </p>

        <p className="whitespace-nowrap text-[clamp(0.7rem,1.4vw,0.9rem)] text-zinc-400">
          {formatedData(empVacationRequest.vacations[0].created_at)}
        </p>
      </div>

      <div className="flex flex-col gap-[clamp(0.5rem,1.5vw,1rem)]">
        {empVacationRequest.vacations.map((el) => (
          <div
            key={`${el.date}-${el.employee_id}`}
            className={`${
              el.status === "declined" ? "opacity-50" : ""
            } grid grid-cols-1 gap-[clamp(0.5rem,1.5vw,1rem)] rounded-xl bg-zinc-800 p-[clamp(0.75rem,2vw,1.25rem)] md:grid-cols-5 md:items-center justify-center`}
          >
            <div className="text-[clamp(0.85rem,1.6vw,1rem)] font-medium">
              {el.date}
            </div>

            <div className="text-[clamp(0.8rem,1.4vw,0.95rem)] text-zinc-300">
              {el.is_scheduled ? (
                <>
                  Scheduled{" "}
                  <span className="font-semibold text-white">
                    {el.hours_scheduled}h
                  </span>
                </>
              ) : (
                <span className="italic text-zinc-400">Not scheduled</span>
              )}
            </div>

            <div>
              <span className="rounded-full bg-teal-600/20 px-3 py-1 text-[clamp(0.65rem,1.2vw,0.75rem)] font-semibold text-teal-400">
                {el.type}
              </span>
            </div>

            <div className="text-[clamp(0.8rem,1.4vw,0.95rem)] text-center text-zinc-300">
              {el.reason || (
                <span className="italic text-zinc-500">No reason</span>
              )}
            </div>

            <div className="flex gap-3 md:justify-end">
              {el.status === "waiting" ? (
                <>
                  <button
                    onClick={() =>
                      changeDecision(
                        "accepted",
                        el.id,
                        el.employee_id,
                        el.schedule_id,
                        el.schedule_day_id
                      )
                    }
                    className="bg-teal-600 py-1 px-3 rounded hover:scale-105 transition-all ease-in-out"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      setCurrentVacation({
                        id: el.id,
                        employee_id: el.employee_id,
                        schedule_id: el.schedule_id,
                        schedule_day_id: el.schedule_day_id,
                      });
                      setShowPopup(true);
                    }}
                    className="bg-red-500 py-1 px-3 rounded hover:scale-105 transition-all ease-in-out"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <div>
                  <span
                    className={`rounded-full  px-3 py-1 text-[clamp(0.65rem,1.2vw,0.75rem)] font-semibold ${
                      el.status === "accepted"
                        ? "bg-teal-600/20 text-teal-600"
                        : " bg-red-600/20 text-red-600"
                    }`}
                  >
                    {el.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {showPopup && currentVacation && (
          <AnimatedDetailOnClick
            setActiveModal={setShowPopup}
            modalKey={"popup"}
          >
            <div className="flex flex-col gap-10">
              <p className="text-[clamp(1rem,2.5vw,2rem)]">
                Why You Reject the vacation ?
              </p>
              <Input
                name=""
                text=""
                type="text"
                onChange={(e) => setReasonRejectValue(e)}
                value={reasonRejectValue}
              />
              <button
                onClick={() => {
                  if (currentVacation) {
                    changeDecision(
                      "declined",
                      currentVacation.id,
                      currentVacation.employee_id,
                      currentVacation.schedule_id,
                      currentVacation.schedule_day_id,
                      reasonRejectValue.trim() || undefined
                    );
                    setShowPopup(false);
                    setReasonRejectValue("");
                    setCurrentVacation(null);
                  }
                }}
                className="bg-red-500 py-1 px-3 rounded hover:scale-105 transition-all ease-in-out"
              >
                Reject
              </button>
            </div>
          </AnimatedDetailOnClick>
        )}
      </AnimatePresence>
    </div>
  );
}
