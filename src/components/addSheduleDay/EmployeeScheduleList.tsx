import React from "react";
import AddSheduleCard from "./AddScheduleCard";
import SheduleCard from "./ScheduleCard";
import EditVacationCard from "./EditVacationCard";
import EditScheduleCard from "./EditScheduleCard";
import { useScheduleLogic } from "@/lib/hooks/useScheduleLogic";
import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { EmployeeShift, ShiftFetched } from "@/app/manage/add/addSheduleDay/page";
import { useAddScheduleFetch } from "@/lib/hooks/useAddScheduleFetch";

type EmployeeScheduleListType = {
  employeesTab: InferSelectModel<typeof employees>[];
  employeeShifts: EmployeeShift[];
  fetchedShiftsData: ShiftFetched[];
  editFetchedShiftsData: ShiftFetched[];
  cantWork: Record<number, boolean | null>;
  editleShow: boolean;
  selectedDate: Date;
  setEmployeeShifts: React.Dispatch<React.SetStateAction<EmployeeShift[]>>;
  setCantWork: React.Dispatch<React.SetStateAction<Record<number, boolean | null>>>;
  addShow: boolean;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setEditleShow: React.Dispatch<React.SetStateAction<boolean>>;
  setFetchedShiftsData: React.Dispatch<React.SetStateAction<ShiftFetched[]>>;
  setEditFetchedShiftsData: React.Dispatch<React.SetStateAction<ShiftFetched[]>>;
  scheduleId: string | null;
};

export default function EmployeeScheduleList({
  employeesTab,
  employeeShifts,
  fetchedShiftsData,
  editFetchedShiftsData,
  cantWork,
  editleShow,
  selectedDate,
  setEmployeeShifts,
  setCantWork,
  addShow,
  setError,
  setEditleShow,
  setFetchedShiftsData,
  setEditFetchedShiftsData,
  scheduleId,
}:EmployeeScheduleListType) {
  
  const {
    dataThreeMonthScheduleDayAllFetched,
    timeOffRequestsFetched,
    setDataThreeMonthScheduleDayAllFetched,
    setTimeOffRequestsData,
  } = useAddScheduleFetch({scheduleId,selectedDate});

  const { formatedData, getRemainingWeeklyHours, CheckIfCanWork, parseData } =
    useScheduleLogic({ selectedDate, dataThreeMonthScheduleDayAllFetched });

  return (
    <div className="p-10 w-full h-fit grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
      {employeesTab.length === 0 ? (
        <p className="font-bold text-center p-5 text-teal-600">
          No Employees found
        </p>
      ) : (
        employeesTab.map((emp, i) => {
          const employeeShift = employeeShifts.find(
            (s) => s.employee_id === emp.id,
          );

          const fetchedShift = fetchedShiftsData.find(
            (s) => s.employee_id === emp.id,
          );

          const editShift = editFetchedShiftsData?.find(
            (s) => s.employee_id === emp.id,
          );

          const timeOff = timeOffRequestsFetched?.find(
            (s) => s.employee_id === emp.id && s.status === "accepted",
          );

          const employeeCantWork = cantWork[emp.id as number] || false;

          if (editleShow && fetchedShift && editShift && !timeOff) {
            return (
              <EditScheduleCard
                selectedDate={selectedDate}
                key={emp.id}
                getRemainingWeeklyHours={getRemainingWeeklyHours}
                employeesTab={employeesTab}
                employeeShifts={employeeShifts}
                setEmployeeShifts={setEmployeeShifts}
                CheckIfCanWork={CheckIfCanWork}
                setCantWork={setCantWork}
                addShow={addShow}
                emp={emp}
                editShift={editShift}
                fetchedShift={fetchedShift}
                i={i}
                setEditleShow={setEditleShow}
                setError={setError}
                editFetchedShiftsData={editFetchedShiftsData}
                setFetchedShiftsData={setFetchedShiftsData}
                setEditFetchedShiftsData={setEditFetchedShiftsData}
                setDataThreeMonthScheduleDayAllFetched={
                  setDataThreeMonthScheduleDayAllFetched
                }
              />
            );
          }

          if (timeOff && !addShow) {
            return (
              <EditVacationCard
                scheduleId={scheduleId}
                setError={setError}
                setEditleShow={setEditleShow}
                timeOff={timeOff}
                cantWork={employeeCantWork}
                key={emp.id}
                addShow={addShow}
                editleShow={editleShow}
                emp={emp}
                setTimeOffRequestsData={setTimeOffRequestsData}
                fetchedShift={fetchedShift}
              />
            );
          }

          if (
            employeeShift &&
            addShow &&
            !fetchedShift &&
            !employeeCantWork &&
            !timeOff
          ) {
            return (
              <AddSheduleCard
                key={emp.id}
                emp={emp}
                dataThreeMonthScheduleDayAllFetched={
                  dataThreeMonthScheduleDayAllFetched
                }
                setDataThreeMonthScheduleDayAllFetched={
                  setDataThreeMonthScheduleDayAllFetched
                }
                fetchedShiftsData={fetchedShiftsData}
                employeeShifts={employeeShifts}
                employeeShift={employeeShift}
                selectedDate={selectedDate}
                setEmployeeShifts={setEmployeeShifts}
              />
            );
          }

          if (!addShow) {
            return (
              <SheduleCard
                cantWork={employeeCantWork}
                key={emp.id}
                addShow={addShow}
                emp={emp}
                fetchedShift={fetchedShift}
              />
            );
          }
        })
      )}
    </div>
  );
}
