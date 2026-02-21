import { scheduleSwapRequestsFetchedType } from "@/lib/hooks/useScheduleFetch";
import React, { SetStateAction } from "react";
import SingleScheduleSwapRequestItemAdmin from "./SingleScheduleSwapRequestItemAdmin";
import { editScheduleSwap } from "@/lib/actions/ScheduleSwap/editScheduleSwap";
import { InferSelectModel } from "drizzle-orm";
import { schedules_day } from "@/db/schema";

type ScheduleSwapRequestContainerAdminType = {
  setScheduleSwapRequestsFetched: React.Dispatch<
    React.SetStateAction<scheduleSwapRequestsFetchedType[]>
  >;
  scheduleSwapRequestsFetched: scheduleSwapRequestsFetchedType[];
  setError: React.Dispatch<SetStateAction<string>>;
  setDataSingleScheduleDayFetched: React.Dispatch<
    SetStateAction<InferSelectModel<typeof schedules_day>[]>
  >;
};

export default function ScheduleSwapRequestContainerAdmin({
  setScheduleSwapRequestsFetched,
  scheduleSwapRequestsFetched,
  setError,
  setDataSingleScheduleDayFetched,
}: ScheduleSwapRequestContainerAdminType) {
  const ChangeDecision = async (
    decision: string,
    scheduleSwapRequest: scheduleSwapRequestsFetchedType,
    rejectReason?: string,
  ) => {
    if (decision === "declined" && !rejectReason?.trim()) {
      setError("Please give us rejection reason");
      return;
    }

    if (!scheduleSwapRequest) return;

    try {
      const switchScheduleSchiftRecive = {
        scheduleDayId: scheduleSwapRequest.scheduleDayRecive?.id ?? null,
        employeeId: scheduleSwapRequest.employeeRecive.id,
      };

      const switchScheduleSchiftRequest = {
        scheduleDayId: scheduleSwapRequest.scheduleDayRequest?.id ?? null,
        employeeId: scheduleSwapRequest.employeeRequest.id,
      };

      const body = {
        scheduleSwapRequestId: scheduleSwapRequest.scheduleSwapRequest.id,
        status: decision,
        rejectReasion: decision === "declined" ? rejectReason : null,
        switchScheduleSchiftRecive,
        switchScheduleSchiftRequest,
      };

      const formData = new FormData();

      formData.append("body", JSON.stringify(body));

      const result = await editScheduleSwap({ errors: {} }, formData);

      console.log(result.success, decision);

      if (result.success) {
        console.log("succes");
        if (decision === "accepted") {
          setError("Schedule swap request accepted")
          setScheduleSwapRequestsFetched((prev) =>
            prev.map((el) =>
              el.scheduleSwapRequest.id ===
              scheduleSwapRequest.scheduleSwapRequest.id
                ? {
                    ...el,
                    scheduleSwapRequest: {
                      ...el.scheduleSwapRequest,
                      status: "accepted",
                    },
                  }
                : el,
            ),
          );
          setDataSingleScheduleDayFetched((prev) =>
            prev.map((el) => {
              if (el.id === switchScheduleSchiftRecive.scheduleDayId) {
                return {
                  ...el,
                  assigned_employee_id: switchScheduleSchiftRequest.employeeId,
                };
              }
              if (el.id === switchScheduleSchiftRequest.scheduleDayId) {
                return {
                  ...el,
                  assigned_employee_id: switchScheduleSchiftRecive.employeeId,
                };
              }
              return el;
            }),
          );
        } else {
          setError("Schedule swap request Rejected")
          setScheduleSwapRequestsFetched((prev) =>
            prev.map((el) =>
              el.scheduleSwapRequest.id ===
              scheduleSwapRequest.scheduleSwapRequest.id
                ? {
                    ...el,
                    scheduleSwapRequest: {
                      ...el.scheduleSwapRequest,
                      status: "declined",
                    },
                  }
                : el,
            ),
          );
        }
      } else {
        setError("Something went wrong");
      }
    } catch (e) {
      console.log(e);
      setError("Request failed");
    }
  };

  console.log(scheduleSwapRequestsFetched);
  return (
    <div className="relative w-[80vw] m-10 p-10 h-fit flex gap-5 flex-col border border-zinc-700 rounded-2xl">
      <h2 className="p-2 text-2xl font-bold mb-2">
        Schedule day swaps Requests:
      </h2>
      {scheduleSwapRequestsFetched.length === 0 ? (
        <div className="p-10 w-full flex justify-center items-center border-white border-1 h-40 rounded-2xl">
          <p className="text-2xl font-bold ">
            No schedule day swaps request here!
          </p>
        </div>
      ) : (
        <div className="flex flex-col  h-fit max-h-200 rounded-2xl p-10 gap-5 overflow-y-auto scrollbar-none">
          {scheduleSwapRequestsFetched
            .sort(
              (a, b) =>
                new Date(b.scheduleSwapRequest.created_at).getTime() -
                new Date(a.scheduleSwapRequest.created_at).getTime(),
            )
            .map((scheduleSwapDay) => (
              <SingleScheduleSwapRequestItemAdmin
                ChangeDecision={ChangeDecision}
                key={scheduleSwapDay.scheduleSwapRequest.id}
                scheduleSwapDay={scheduleSwapDay}
              />
            ))}
        </div>
      )}
    </div>
  );
}
