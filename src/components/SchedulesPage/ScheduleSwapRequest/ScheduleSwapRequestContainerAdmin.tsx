import { scheduleSwapRequestsFetchedType } from "@/lib/hooks/useScheduleFetch";
import React, { SetStateAction } from "react";
import SingleScheduleSwapRequestItemAdmin from "./SingleScheduleSwapRequestItemAdmin";
import { editScheduleSwap } from "@/lib/actions/ScheduleSwap/editScheduleSwap";

type ScheduleSwapRequestContainerAdminType = {
  setScheduleSwapRequestsFetched: React.Dispatch<
    React.SetStateAction<scheduleSwapRequestsFetchedType[]>
  >;
  scheduleSwapRequestsFetched: scheduleSwapRequestsFetchedType[];
  setError: React.Dispatch<SetStateAction<string>>;
};

export default function ScheduleSwapRequestContainerAdmin({
  setScheduleSwapRequestsFetched,
  scheduleSwapRequestsFetched,
  setError,
}: ScheduleSwapRequestContainerAdminType) {
  const ChangeDecision = async (
    decison: string,
    scheduleSwapRequest: scheduleSwapRequestsFetchedType,
    rejectReasion?: string,
  ) => {
    if (rejectReasion?.length === 0 && decison == "declined") {
      setError("Please give us rejection reason");
      return;
    }

    if (!scheduleSwapRequest) return;

    try {
      const formData = new FormData();

      Object.entries(scheduleSwapRequest).forEach(([key, value]) => {
        formData.append(key + "Id", value?.id?.toString() ?? "timeOff");
      });

      formData.append("status", decison);

      if (rejectReasion) {
        formData.append("rejectReasion", rejectReasion);
      }

      console.log(scheduleSwapRequest)

      const switchScheduleSchiftRecive = {
        scheduleDayId: scheduleSwapRequest.scheduleDayRecive?.id || null,
        employeeId: scheduleSwapRequest.employeeRecive.id,
        scheduleDay: scheduleSwapRequest.scheduleDayRecive,
        scheduleDaySwitched: {
          ...scheduleSwapRequest.scheduleDayRequest,
          assigned_employee_id: scheduleSwapRequest.employeeRequest.id,
        },
      };

      
      formData.append(
        "switchScheduleSchiftRecive",
        JSON.stringify(switchScheduleSchiftRecive),
      );

      const switchScheduleSchiftRequest = {
        scheduleDayId: scheduleSwapRequest.scheduleDayRequest?.id || null,
        employeeId: scheduleSwapRequest.employeeRequest.id,
        scheduleDay: scheduleSwapRequest.employeeRequest,
        scheduleDaySwitched: {
          ...scheduleSwapRequest.scheduleDayRecive,
          assigned_employee_id: scheduleSwapRequest.employeeRecive.id,
        },
      };
      
      console.log(switchScheduleSchiftRecive,switchScheduleSchiftRequest)

      formData.append(
        "switchScheduleSchiftRequest",
        JSON.stringify(switchScheduleSchiftRequest),
      );

      console.log([...formData])

      const result = await editScheduleSwap({ errors: {} }, formData);

      console.log(scheduleSwapRequest);

      // jesli git zamien im dniówki jesli nie to chuja rob, wez resulta pokaz w setError
      // a no i update UI z tego editScheduleSwap
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

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
