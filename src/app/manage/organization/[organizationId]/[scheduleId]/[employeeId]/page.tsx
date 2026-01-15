"use client";
import DashboardHeader from "@/components/UI/DashboardHeader";
import { employees, schedules_day, time_off_requests } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useFetch from "../../../../../../lib/hooks/useFetch";
import Loader from "@/components/UI/Loader";
import EmployeeDetails from "@/components/SchedulesPage/Employee/EmployeeDetails";
import EmployeeCalcSalary from "@/components/SchedulesPage/Employee/EmployeeCalcSalary";
import EmployeeShifts from "@/components/SchedulesPage/Employee/EmployeeShifts";
import ClassicCalendarEmployeeSchifts from "@/components/SchedulesPage/Calendars/ClassicCalendarEmployeeSchifts";
import RenderAnimation from "@/animations/RenderAnimation";
import VacationRequestContainer from "@/components/SchedulesPage/VacationRequestContainerAdmin";
import VacationRequestContainerUser from "@/components/SchedulesPage/Employee/VacationRequestContainerUser";
import { useEmployeeDataContext } from "@/context/employeeContext";

export default function page() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.employeeId;
  const scheduleId = params.scheduleId;
  const [employeesFetched, setEmployeesFetched] = useState<
    InferSelectModel<typeof employees>[]
  >([]);
  const [employeeFetched, setEmployeeFetched] = useState<
    InferSelectModel<typeof employees>
  >({} as InferSelectModel<typeof employees>);
  const [timeOffRequestsData, setTimeOffRequestsData] = useState<
    InferSelectModel<typeof time_off_requests>[]
  >([]);

  const { role, isPendingEmployee } = useEmployeeDataContext();

  const [error, setError] = useState<string>("");

  const today = new Date();

  const pastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const presentMonth = today.toISOString().split("T")[0];

  const futureMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const {
    data: dataEmployees,
    isPending: isPendingEmployees,
    error: errorEmployees,
  } = useFetch<InferSelectModel<typeof employees>[]>(
    `/api/employees?id=${scheduleId}`
  );

  const {
    data: dataSingleScheduleDayOfEmployee,
    isPending: isPendingSingleScheduleDayOfEmployee,
    error: errorSingleScheduleDayOfEmployee,
  } = useFetch<InferSelectModel<typeof schedules_day>[]>(
    `/api/schedules_day/${scheduleId}/${employeeId}`
  );

  const {
    data: dataThreeMonthScheduleDay,
    isPending: isPendingThreeMonthScheduleDay,
    error: errorThreeMonthScheduleDay,
  } = useFetch<InferSelectModel<typeof schedules_day>[][]>(
    `/api/schedules_day/${scheduleId}/${employeeId}?presentMonth=${presentMonth}&pastMonth=${pastMonth}&futureMonth=${futureMonth}`
  );

  const {
    data: dataThreeMonthScheduleDayAll,
    isPending: isPendingThreeMonthScheduleDayAll,
    error: errorThreeMonthScheduleDayAll,
  } = useFetch<InferSelectModel<typeof schedules_day>[][]>(
    `/api/schedules_day/${scheduleId}?presentMonth=${presentMonth}&pastMonth=${pastMonth}&futureMonth=${futureMonth}`
  );

  const {
    data: dataTimeOffRequests,
    isPending: isPendingTimeOffRequests,
    error: errorTimeOffRequests,
  } = useFetch<InferSelectModel<typeof time_off_requests>[]>(
    `/api/time-off-request/${scheduleId}/${employeeId}`
  );

  useEffect(() => {
    if (dataTimeOffRequests) {
      setTimeOffRequestsData(dataTimeOffRequests);
    }
  }, [dataTimeOffRequests]);

  useEffect(() => {
    if (dataEmployees) {
      setEmployeeFetched(
        dataEmployees.filter((el) => el.id === Number(employeeId))[0]
      );
    }
  }, [dataEmployees]);

  useEffect(() => {
    if (employeesFetched) {
      setEmployeeFetched(
        employeesFetched.filter((el) => el.id === Number(employeeId))[0]
      );
    }
  }, [employeesFetched]);

  useEffect(() => {
    if (dataEmployees) {
      setEmployeesFetched(dataEmployees);
    }
  }, [dataEmployees]);

  if (
    errorSingleScheduleDayOfEmployee ||
    errorEmployees ||
    errorThreeMonthScheduleDay ||
    errorThreeMonthScheduleDayAll ||
    errorTimeOffRequests
  ) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-red-500">Error loading employee data</p>
      </div>
    );
  }

  if (
    isPendingSingleScheduleDayOfEmployee ||
    isPendingTimeOffRequests ||
    isPendingEmployees ||
    isPendingEmployee ||
    isPendingThreeMonthScheduleDayAll ||
    isPendingThreeMonthScheduleDay ||
    !employeeFetched ||
    !dataSingleScheduleDayOfEmployee ||
    !employeesFetched ||
    !dataThreeMonthScheduleDay ||
    !dataThreeMonthScheduleDayAll ||
    !dataTimeOffRequests ||
    !role
  ) {
    return <Loader />;
  }

  return (
    <div className="flex w-full h-full flex-col scrollbar-none overflow-y-auto">
      <DashboardHeader
        onClick={() => router.back()}
        title={employeeFetched.name ?? ""}
        error={error}
      />
      <RenderAnimation animationKey={"AddPage"}>
        <EmployeeDetails
          dataEmployee={employeeFetched}
          setEmployeesFetched={setEmployeesFetched}
          dataEmployees={employeesFetched}
          setError={setError}
        />
        <ClassicCalendarEmployeeSchifts
          dataSingleScheduleDayOfEmployee={dataSingleScheduleDayOfEmployee}
          employeeId={employeeId}
          scheduleId={scheduleId}
          timeOffRequestsData={timeOffRequestsData}
          setTimeOffRequestsData={setTimeOffRequestsData}
          setError={setError}
          role={role}
        />
        {/* center it */}
        <VacationRequestContainerUser
          timeOffRequestsData={timeOffRequestsData}
        />
        <EmployeeCalcSalary
          employeeFetched={employeeFetched}
          dataThreeMonthScheduleDay={dataThreeMonthScheduleDay}
          dataThreeMonthScheduleDayAll={dataThreeMonthScheduleDayAll}
          presentMonth={presentMonth}
          employeesFetched={employeesFetched}
        />
      </RenderAnimation>
    </div>
  );
}
