"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useFetch from "../../../../../../hooks/useFetch";
import RenderAnimation from "@/animations/RenderAnimation";
import { InferSelectModel } from "drizzle-orm";
import { employees, schedules } from "@/db/schema";
import ClassicCalendar from "@/components/SchedulesPage/Calendars/ClassicCalendar";
import EmployeesDatalist from "@/components/SchedulesPage/Employees";
import { useUserDataContext } from "@/context/userContext";
import Loader from "@/components/UI/Loader";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.scheduleId;
  const [employeeLogInRole, setEmployeeLogInRole] = useState("");
  const [employeesTab, setEmployeesTab] = useState<
    InferSelectModel<typeof employees>[]
  >([]);

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

  const { data: employeeLogInData } =
    useFetch<InferSelectModel<typeof employees>>(`/api/employees/me`);

  useEffect(() => {
    if (employeeLogInData) {
      setEmployeeLogInRole(employeeLogInData.role);
    }
  }, [employeeLogInData]);

  useEffect(() => {
    if (dataEmployees) {
      setEmployeesTab(dataEmployees);
      localStorage.setItem("employeesTab", JSON.stringify(dataEmployees));
    }
  }, [dataEmployees]);

  if (
    isPendingSchedule ||
    isPendingEmployees ||
    !dataSchedule ||
    !dataEmployees
  ) {
    return (
      <Loader/>
    );
  }

  if (errorSchedule || errorEmployees) {
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
    <RenderAnimation animationKey={"AddPage"}>
      <div className="flex w-full h-full flex-col p-10 scroll-none">
        <div className="flex w-full items-center gap-4 p-4 rounded-lg">
          <button
            onClick={() => router.back()}
            className="hover:scale-150 transition-all ease-in-out cursor-pointer"
          >
            <Image
              src={"/Icons/arrowIcon.svg"}
              width={50}
              height={50}
              alt="arrow"
              className="rotate-270 invert"
            />
          </button>
          <h1 className="text-[clamp(1rem,6vw,2rem)] font-bold text-white">
            {dataSchedule.name}
          </h1>
        </div>
        <div className="w-full flex flex-col items-center h-full">
          <ClassicCalendar scheduleId={scheduleId} />
          <EmployeesDatalist
            scheduleId={scheduleId}
            employeesTab={employeesTab ? employeesTab : []}
            employeeLogInRole={employeeLogInRole}
          />
        </div>
      </div>
    </RenderAnimation>
  );
}
