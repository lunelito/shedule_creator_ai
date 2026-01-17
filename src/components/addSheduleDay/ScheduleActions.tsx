import { useEmployeeDataContext } from "@/context/employeeContext";
import { useScheduleLogic } from "@/lib/hooks/useScheduleLogic";
import React from "react";
import PrimaryButton from "../UI/PrimaryButton";
import SecondaryButton from "../UI/SecondaryButton";
import { InferSelectModel } from "drizzle-orm";
import { employees } from "@/db/schema";
import { EmployeeShift, ShiftFetched } from "@/app/manage/add/addSheduleDay/page";

export type ScheduleActionsProps = {
  editleShow: boolean;
  addShow: boolean;
  employeeId: string | null;
  handleEdit: () => Promise<false | undefined>
  handleSubmit: () => Promise<false | undefined>
  cantWork: Record<number, boolean | null>;
  employeesTab: InferSelectModel<typeof employees>[];
  employeeShifts: EmployeeShift[];
  shiftsDataFetchedParsed: ShiftFetched[];
  setEditleShow: React.Dispatch<React.SetStateAction<boolean>>;
  setAddShow: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
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
}: ScheduleActionsProps) {
    
  const { role } = useEmployeeDataContext();

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
              {!addShow && (
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
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
