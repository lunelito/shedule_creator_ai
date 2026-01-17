import React, { SetStateAction, useEffect, useState } from "react";
import useFetch from "../../../lib/hooks/useFetch";
import { ParamValue } from "next/dist/server/request/params";
import { InferSelectModel } from "drizzle-orm";
import { employees, time_off_requests } from "@/db/schema";
import SingleVacationRequestItemAdmin from "./SingleVacationRequestItemAdmin";
import { editVacation } from "@/lib/actions/Vacations/editVacation";
import { deleteSchedule } from "@/lib/actions/Schedule/deleteShedule";
import { deleteSingleScheduleDay } from "@/lib/actions/ScheduleDay/deleteSingleScheduleDay";

type VacationRequestContainerType = {
  scheduleId: ParamValue;
  employeesTab: InferSelectModel<typeof employees>[];
  timeOffRequestsData: InferSelectModel<typeof time_off_requests>[];
  setError: React.Dispatch<SetStateAction<string>>;
  setTimeOffRequestsData: React.Dispatch<
    SetStateAction<InferSelectModel<typeof time_off_requests>[]>
  >;
  userId: number;
};

export type vacationDataType = InferSelectModel<typeof employees> & {
  vacations: InferSelectModel<typeof time_off_requests>[];
};

export default function VacationRequestContainerAdmin({
  scheduleId,
  employeesTab,
  timeOffRequestsData,
  setError,
  userId,
  setTimeOffRequestsData,
}: VacationRequestContainerType) {
  const [vacationData, setVacationData] = useState<vacationDataType[]>([]);

  useEffect(() => {
    if (timeOffRequestsData && employeesTab) {
      const joinedData = employeesTab
        .map((emp) => {
          const vacations = timeOffRequestsData.filter(
            (el) => el.employee_id === emp.id
          );

          return {
            ...emp,
            vacations,
          };
        })
        .filter((el) => el.vacations.length !== 0);

      setVacationData(joinedData);
    }
  }, [timeOffRequestsData, employeesTab]);

  const changeDecision = async (
    decision: string,
    vacationId: number,
    empId: number,
    scheduleId: number,
    schedule_day_id: number | null,
    reasonReject?: string
  ) => {
    console.log(vacationId, empId, scheduleId, schedule_day_id);
    if (!vacationId || !empId || !scheduleId) return;

    try {
      const formData = new FormData();

      formData.append("vacationId", vacationId.toString());
      formData.append("empId", empId.toString());
      formData.append("decision", decision.toString());
      formData.append("scheduleId", scheduleId.toString());
      formData.append("userId", userId.toString());

      if (reasonReject) {
        formData.append("reasonReject", reasonReject);
      }

      let resultDelete = true;

      const resultUpdate = await editVacation({ errors: {} }, formData);

      if (decision === "declined" && reasonReject?.length === 0) {
        setError("Please enter reject reason");
        return;
      }

      if (resultUpdate.success && schedule_day_id) {
        resultDelete = (
          await deleteSingleScheduleDay(schedule_day_id.toString())
        ).success;
      }

      if (resultDelete) {
        setTimeOffRequestsData((prev) =>
          prev.map((vac) =>
            vac.id === vacationId
              ? {
                  ...vac,
                  status: decision,
                  rejection_reason:
                    reasonReject && reasonReject?.length > 0
                      ? reasonReject
                      : null,
                }
              : vac
          )
        );

        const errorMsg = resultUpdate.errors._form
          ? resultUpdate.errors._form[0]
          : resultUpdate.errors._form?.[0] ?? "server error";

        setError(errorMsg);
        setTimeout(() => setError(""), 2000);
      }
    } catch (e) {
      setError("server error");
    }
  };

  return (
    <div className="relative w-[80vw] m-10 p-10 h-fit flex gap-5 flex-col border border-zinc-700 rounded-2xl">
      <h2 className="p-2 text-2xl font-bold mb-2">Vacation Requests:</h2>
      {vacationData.length === 0 ? (
        <div className="p-10 w-full flex justify-center items-center border-white border-1 h-40 rounded-2xl">
          <p className="text-2xl font-bold ">No vacations request here!</p>
        </div>
      ) : (
        <div className="flex flex-col  h-fit max-h-200 rounded-2xl p-10 gap-5 overflow-y-auto scrollbar-none">
          {vacationData
            .sort(
              (a, b) =>
                new Date(b.vacations[0].created_at).getTime() -
                new Date(a.vacations[0].created_at).getTime()
            )
            .map((empVacationRequest) => (
              <SingleVacationRequestItemAdmin
                key={empVacationRequest.user_id}
                empVacationRequest={empVacationRequest}
                changeDecision={changeDecision}
              />
            ))}
        </div>
      )}
    </div>
  );
}
