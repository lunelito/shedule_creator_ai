"use client";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useFetch from "../../../../../../hooks/useFetch";
import RenderAnimation from "@/animations/RenderAnimation";
import { InferSelectModel } from "drizzle-orm";
import {
  employees,
  schedules,
  schedules_day,
  time_off_requests,
} from "@/db/schema";
import ClassicCalendar from "@/components/SchedulesPage/Calendars/ClassicCalendar";
import EmployeesDatalist from "@/components/SchedulesPage/Employees";
import { useUserDataContext } from "@/context/userContext";
import Loader from "@/components/UI/Loader";
import DashboardHeader from "@/components/UI/DashboardHeader";
import RowCalendar from "@/components/SchedulesPage/Calendars/RowCalendar";
import EmployeeWork from "@/components/SchedulesPage/EmployeeWork";
import { useEmployeeDataContext } from "@/context/employeeContext";
import VacationRequestContainer from "@/components/SchedulesPage/VacationRequestContainer";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.scheduleId;
  const pathname = usePathname();
  const organizationId = pathname.split("/")[3];
  const [employeeLogInRole, setEmployeeLogInRole] = useState("");
  const [employeesTab, setEmployeesTab] = useState<
    InferSelectModel<typeof employees>[]
  >([]);
  const [timeOffRequestsData, setTimeOffRequestsData] = useState<
    InferSelectModel<typeof time_off_requests>[]
  >([]);
  const [error, setError] = useState("");

  const { role, isPendingEmployee, dataEmployee } = useEmployeeDataContext();
  const { userData, isPending } = useUserDataContext();

  const {
    data: dataSchedule,
    isPending: isPendingSchedule,
    error: errorSchedule,
  } = useFetch<InferSelectModel<typeof schedules>>(
    `/api/schedules/${scheduleId}`
  );

  const {
    data: dataEmployees,
    isPending: isPendingEmployees,
    error: errorEmployees,
  } = useFetch<InferSelectModel<typeof employees>[]>(
    `/api/employees?id=${scheduleId}`
  );

  const {
    data: dataSingleScheduleDay,
    isPending: isPendingSingleScheduleDay,
    error: errorSingleScheduleDay,
  } = useFetch<InferSelectModel<typeof schedules_day>[]>(
    `/api/schedules_day/${scheduleId}`
  );

  const {
    data: dataTimeOffRequests,
    isPending: isTimeOffRequests,
    error: errorTimeOffRequests,
  } = useFetch<InferSelectModel<typeof time_off_requests>[]>(
    `/api/time-off-request/${scheduleId}`
  );

  useEffect(() => {
    if (role) {
      setEmployeeLogInRole(role);
    }
  }, [role]);

  useEffect(() => {
    if (dataTimeOffRequests) {
      setTimeOffRequestsData(dataTimeOffRequests);
    }
  }, [dataTimeOffRequests]);

  useEffect(() => {
    if (dataEmployees) {
      setEmployeesTab(dataEmployees);
      localStorage.setItem("employeesTab", JSON.stringify(dataEmployees));
    }
  }, [dataEmployees]);

  if (
    isPendingSchedule ||
    isPendingEmployees ||
    isPendingSingleScheduleDay ||
    isPending ||
    isPendingEmployee ||
    !dataSchedule ||
    !dataEmployees ||
    !dataSingleScheduleDay ||
    !dataEmployee ||
    !userData
  ) {
    return <Loader />;
  }

  if (errorSchedule || errorEmployees || errorSingleScheduleDay) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-red-500">Error loading schedule</p>
      </div>
    );
  }

  if (!scheduleId) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p>Schedule not found</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full flex-col scroll-none">
      <DashboardHeader
        error={error}
        onClick={() => router.back()}
        title={dataSchedule.name}
      />
      <RenderAnimation animationKey={"AddPage"}>
        <div className="w-full flex flex-col items-center h-full p-10">
          <RowCalendar
            organizationId={organizationId}
            dataSingleScheduleDay={dataSingleScheduleDay}
            employeesTab={employeesTab}
            scheduleId={scheduleId}
          />
          <EmployeeWork
            employeeLogInRole={employeeLogInRole}
            dataSingleScheduleDay={dataSingleScheduleDay}
            employeesTab={employeesTab}
          />
          <ClassicCalendar
            scheduleId={scheduleId}
            organizationId={organizationId}
          />
          <VacationRequestContainer
            timeOffRequestsData={timeOffRequestsData}
            scheduleId={scheduleId}
            employeesTab={employeesTab}
            setError={setError}
            userId={userData.id}
          />
          <EmployeesDatalist
            scheduleId={scheduleId}
            employeesTab={employeesTab}
            employeeLogInRole={employeeLogInRole}
          />
        </div>
      </RenderAnimation>
    </div>
  );
}
