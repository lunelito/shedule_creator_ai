import { useEmployeeDataContext } from "@/context/employeeContext";
import { useScheduleLogic } from "@/lib/hooks/useScheduleLogic";
import React from "react";
import PrimaryButton from "../UI/PrimaryButton";
import SecondaryButton from "../UI/SecondaryButton";
import { InferSelectModel } from "drizzle-orm";
import { employees } from "@/db/schema";
import {
  EmployeeShift,
  ShiftFetched,
} from "@/app/manage/add/addSheduleDay/page";
import { scheduleSwapRequestsFetchedType } from "@/lib/hooks/useScheduleFetch";

export type ScheduleActionsProps = {
  editleShow: boolean;
  addShow: boolean;
  employeeId: string | null;
  handleEdit: () => Promise<false | undefined>;
  handleSubmit: () => Promise<false | undefined>;
  cantWork: Record<number, boolean | null>;
  employeesTab: InferSelectModel<typeof employees>[];
  employeeShifts: EmployeeShift[];
  shiftsDataFetchedParsed: ShiftFetched[];
  setEditleShow: React.Dispatch<React.SetStateAction<boolean>>;
  setAddShow: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  scheduleSwapRequestsFetched: scheduleSwapRequestsFetchedType[];
  selectedDate: Date;
};

export default function ScheduleActions({
  editleShow,
  addShow,
  employeeId,
  handleEdit,
  cantWork,
  handleSubmit,
  employeesTab,
  setEditleShow,
  setError,
  employeeShifts,
  shiftsDataFetchedParsed,
  setAddShow,
  scheduleSwapRequestsFetched,
  selectedDate,
}: ScheduleActionsProps) {
  const { role } = useEmployeeDataContext();
  const { formatedData } = useScheduleLogic({});

  const scheduleSwap = employeesTab.map((emp) => {
    if (!employeeId) {
      return scheduleSwapRequestsFetched.some((el) => {
        const req = el.scheduleSwapRequest;

        const isWaiting = req.status === "waiting";
        const isReceiver = req.employee_id_recive === emp.id;
        const isRequester = req.employee_id_request === emp.id;

        const isReceiveDate =
          formatedData(req.date_recive) === formatedData(selectedDate);

        const isRequestDate =
          formatedData(req.date_request) === formatedData(selectedDate);

        return (
          isWaiting &&
          ((isReceiver && isReceiveDate) || (isRequester && isRequestDate))
        );
      });
    } else {
      if (emp.id === Number(employeeId)) {
        return scheduleSwapRequestsFetched.some((el) => {
          const req = el.scheduleSwapRequest;

          const isWaiting = req.status === "waiting";
          const isReceiver = req.employee_id_recive === emp.id;
          const isRequester = req.employee_id_request === emp.id;

          const isReceiveDate =
            formatedData(req.date_recive) === formatedData(selectedDate);

          const isRequestDate =
            formatedData(req.date_request) === formatedData(selectedDate);

          return (
            isWaiting &&
            ((isReceiver && isReceiveDate) || (isRequester && isRequestDate))
          );
        });
      }
    }
  }).length;

  console.log(scheduleSwap, shiftsDataFetchedParsed.length);
  console.log(!addShow && scheduleSwap - shiftsDataFetchedParsed.length > 0);

  return (
    <div>
      {role === "admin" && (
        <>
          {editleShow && (
            <div className="mt-8 flex justify-center gap-4">
              <PrimaryButton onClick={handleEdit}>Edit Shifts</PrimaryButton>
            </div>
          )}
          {addShow && (!employeeId || !cantWork[Number(employeeId)]) && (
            <div className="mt-8 flex justify-center gap-4">
              <PrimaryButton onClick={handleSubmit}>Add Shifts</PrimaryButton>
            </div>
          )}
        </>
      )}

      <div className="mt-6 text-center text-sm ">
        {employeesTab.length > 0 && !cantWork && (
          <p className="text-gray-400">
            Configuring shifts for {employeesTab.length} employee
            {employeesTab.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {role === "admin" && (
        <div className="flex justify-center gap-5 m-5">
          {!employeeId && (
            <>
              {!addShow &&
                scheduleSwap - shiftsDataFetchedParsed.length > 0 && (
                  <SecondaryButton
                    onClick={() => {
                      setEditleShow((prev) => !prev);
                      setError("");
                    }}
                  >
                    {editleShow ? "see" : "edit"} schedule hours
                  </SecondaryButton>
                )}

              {!(
                !editleShow &&
                employeeShifts.length ===
                  shiftsDataFetchedParsed.length +
                    employeeShifts.filter(
                      (el) => el.cantWork !== null && el.cantWork !== false,
                    ).length
              ) && (
                <SecondaryButton
                  onClick={() => {
                    setAddShow((prev) => !prev);
                    setError("");
                  }}
                >
                  {addShow ? "see" : "add"} schedule hours
                </SecondaryButton>
              )}
            </>
          )}

          {employeeId && (
            <div className="m-5">
              {employeesTab.map((emp) => {
                const fetchedShift = shiftsDataFetchedParsed.find(
                  (s) => s.employee_id === emp.id,
                );
                if (scheduleSwap - shiftsDataFetchedParsed.length > 0) {
                  if (fetchedShift) {
                    return (
                      <SecondaryButton
                        key={"btn"}
                        onClick={() => {
                          setEditleShow((prev) => !prev);
                          setError("");
                        }}
                      >
                        {editleShow ? "see" : "edit"} schedule hours
                      </SecondaryButton>
                    );
                  } else if (!cantWork[Number(employeeId)]) {
                    return (
                      <SecondaryButton
                        key={"btn"}
                        onClick={() => {
                          setAddShow((prev) => !prev);
                          setError("");
                        }}
                      >
                        {addShow ? "see" : "add"} schedule hours
                      </SecondaryButton>
                    );
                  }
                }
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
