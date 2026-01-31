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
import VacationRequestContainer from "@/components/SchedulesPage/Vacations/VacationRequestContainerAdmin";
import VacationRequestContainerUser from "@/components/SchedulesPage/Vacations/VacationRequestContainerUser";
import { useEmployeeDataContext } from "@/context/employeeContext";
import { useEmployeeFetch } from "@/lib/hooks/useEmployeeFetch";
import RowCalendarWithSwap from "@/components/SchedulesPage/Calendars/RowCalendarWithSwap";
import { useAddScheduleFetch } from "@/lib/hooks/useAddScheduleFetch";
import { useScheduleFetch } from "@/lib/hooks/useScheduleFetch";
import Image from "next/image";

export default function page() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.employeeId;
  const scheduleId = params.scheduleId;
  const [timeOffCalendarShow, setTimeOffCalendarShow] = useState<boolean>();

  const { role, isPendingEmployee } = useEmployeeDataContext();

  const [error, setError] = useState<string>("");

  const {
    employeesFetched,
    employeeFetched,
    singleScheduleDayFetched,
    threeMonthScheduleDayFetched,
    threeMonthScheduleDayAllFetched,
    timeOffRequestsFetched,
    isPending,
    presentMonth,
    setEmployeesFetched,
    setTimeOffRequestsFetched,
    error: errorFetch,
  } = useEmployeeFetch({
    scheduleId: Number(scheduleId),
    employeeId: Number(employeeId),
  });

  const {
    employeesTabFetched,
    dataSingleScheduleDayFetched,
    isPending: isPendingFetch,
    error: errorFetchSchedule,
  } = useScheduleFetch({ scheduleId: Number(scheduleId) });

  if (errorFetch || errorFetchSchedule || !employeeId) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-red-500">Error loading employee data</p>
      </div>
    );
  }

  if (
    isPending ||
    isPendingEmployee ||
    !role ||
    isPendingFetch ||
    !employeeId
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
        <div className="flex flex-col justify-center items-center">
          <button
            className="hover:scale-105 transition ease-in-out"
            onClick={() => setTimeOffCalendarShow(true)}
          >
            <Image
              className="invert"
              src={"/icons/arrowIcon.svg"}
              alt="arrow"
              width={50}
              height={50}
            />
          </button>
          {timeOffCalendarShow ? (
            <RowCalendarWithSwap
              threeMonthScheduleDayAllFetched={threeMonthScheduleDayAllFetched}
              employeeId={employeeId}
              role={role}
              dataSingleScheduleDay={dataSingleScheduleDayFetched}
              timeOffRequestsData={timeOffRequestsFetched}
              employeesTabFetched={employeesTabFetched}
              setError={setError}
            />
          ) : (
            <ClassicCalendarEmployeeSchifts
              dataSingleScheduleDayOfEmployee={singleScheduleDayFetched}
              employeeId={employeeId}
              scheduleId={scheduleId}
              timeOffRequestsData={timeOffRequestsFetched}
              setTimeOffRequestsData={setTimeOffRequestsFetched}
              setError={setError}
              role={role}
            />
          )}
          <button
            className="hover:scale-105 rotate-180 transition ease-in-out"
            onClick={() => setTimeOffCalendarShow(false)}
          >
            <Image
              className="invert"
              src={"/icons/arrowIcon.svg"}
              alt="arrow"
              width={50}
              height={50}
            />
          </button>
        </div>
        {/* center it */}
        <VacationRequestContainerUser
          timeOffRequestsData={timeOffRequestsFetched}
        />
        <EmployeeCalcSalary
          employeeFetched={employeeFetched}
          dataThreeMonthScheduleDay={threeMonthScheduleDayFetched}
          dataThreeMonthScheduleDayAll={threeMonthScheduleDayAllFetched}
          presentMonth={presentMonth}
          employeesFetched={employeesFetched}
        />
      </RenderAnimation>
    </div>
  );
}
