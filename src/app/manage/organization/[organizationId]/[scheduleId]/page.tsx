"use client";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useFetch from "../../../../../lib/hooks/useFetch";
import RenderAnimation from "@/animations/RenderAnimation";
import { InferSelectModel } from "drizzle-orm";
import {
  employees,
  schedules,
  schedules_day,
  time_off_requests,
} from "@/db/schema";
import ClassicCalendar from "@/components/SchedulesPage/Calendars/ClassicCalendar";
import EmployeesDatalist from "@/components/SchedulesPage/Schedule/Employees";
import { useUserDataContext } from "@/context/userContext";
import Loader from "@/components/UI/Loader";
import DashboardHeader from "@/components/UI/DashboardHeader";
import RowCalendar from "@/components/SchedulesPage/Calendars/RowCalendar";
import EmployeeWork from "@/components/SchedulesPage/Schedule/EmployeeWork";
import { useEmployeeDataContext } from "@/context/employeeContext";
import VacationRequestContainer from "@/components/SchedulesPage/VacationsRequest/VacationRequestContainerAdmin";
import { useScheduleFetch } from "@/lib/hooks/useScheduleFetch";
import ScheduleSwapRequestContainerAdmin from "@/components/SchedulesPage/ScheduleSwapRequest/ScheduleSwapRequestContainerAdmin";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.scheduleId;
  const pathname = usePathname();
  const organizationId = pathname.split("/")[3];
  const [error, setError] = useState("");

  const { role, isPendingEmployee, errorEmployee } = useEmployeeDataContext();

  const { userData, isPending, error: errorUser } = useUserDataContext();

  const {
    employeesTabFetched,
    timeOffRequestsDataFetched,
    dataScheduleFetched,
    dataSingleScheduleDayFetched,
    scheduleSwapRequestsFetched,
    isPending: isPendingFetch,
    error: errorFetch,
    setTimeOffRequestsDataFetched,
    setScheduleSwapRequestsFetched,
    setDataSingleScheduleDayFetched,
  } = useScheduleFetch({ scheduleId: Number(scheduleId) });

  if (isPendingFetch || isPending || isPendingEmployee || !role || !userData) {
    return <Loader />;
  }

  if (errorFetch || errorEmployee || errorUser) {
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
        title={dataScheduleFetched.name}
      />
      <RenderAnimation animationKey={"AddPage"}>
        <div className="w-full flex flex-col items-center h-full p-10">
          <RowCalendar
            scheduleSwapRequestsFetched={scheduleSwapRequestsFetched}
            timeOffRequestsData={timeOffRequestsDataFetched}
            organizationId={organizationId}
            dataSingleScheduleDay={dataSingleScheduleDayFetched}
            employeesTab={employeesTabFetched}
            scheduleId={scheduleId}
          />
          <EmployeeWork
            employeeLogInRole={role}
            dataSingleScheduleDay={dataSingleScheduleDayFetched}
            employeesTab={employeesTabFetched}
          />
          <ClassicCalendar
            scheduleId={scheduleId}
            organizationId={organizationId}
          />
          <VacationRequestContainer
            timeOffRequestsData={timeOffRequestsDataFetched}
            setTimeOffRequestsData={setTimeOffRequestsDataFetched}
            scheduleId={scheduleId}
            employeesTab={employeesTabFetched}
            setError={setError}
            userId={userData.id}
          />
          <ScheduleSwapRequestContainerAdmin
            setScheduleSwapRequestsFetched={setScheduleSwapRequestsFetched}
            scheduleSwapRequestsFetched={scheduleSwapRequestsFetched}
            setDataSingleScheduleDayFetched={setDataSingleScheduleDayFetched}
            setError={setError}
          />
          <EmployeesDatalist
            scheduleId={scheduleId}
            employeesTab={employeesTabFetched}
            employeeLogInRole={role}
          />
        </div>
      </RenderAnimation>
    </div>
  );
}
