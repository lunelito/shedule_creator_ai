"use client";
import DashboardHeader from "@/components/UI/DashboardHeader";
import { employees, schedules_day } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useFetch from "../../../../../../../hooks/useFetch";
import Loader from "@/components/UI/Loader";
import EmployeeDetails from "@/components/SchedulesPage/Employee/EmployeeDetails";
import EmployeeCalcSalary from "@/components/SchedulesPage/Employee/EmployeeCalcSalary";
import EmployeeShifts from "@/components/SchedulesPage/Employee/EmployeeShifts";

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
  const [error, setError] = useState<string>("");

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
  } = useFetch<InferSelectModel<typeof schedules_day>>(
    `/api/schedules_day/${scheduleId}/${employeeId}`
  );

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

  if (errorSingleScheduleDayOfEmployee || errorEmployees) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-red-500">Error loading employee data</p>
      </div>
    );
  }

  if (
    isPendingSingleScheduleDayOfEmployee ||
    isPendingEmployees ||
    !employeeFetched ||
    !dataSingleScheduleDayOfEmployee ||
    !employeesFetched
  ) {
    return <Loader />;
  }

  console.log(dataSingleScheduleDayOfEmployee, employeeFetched);

  return (
    <div className="w-full">
      <DashboardHeader
        onClick={() => router.back()}
        title={employeeFetched.name ?? ""}
        error={error}
      />
      {/* jego dane */}
      <EmployeeDetails
        dataSingleScheduleDayOfEmployee={dataSingleScheduleDayOfEmployee}
        dataEmployee={employeeFetched}
        setEmployeesFetched={setEmployeesFetched}
        dataEmployees={employeesFetched}
        setError={setError}
      />
      {/* wyswietl kalendarz i zaznacz kiedy pracuje */}
      <EmployeeShifts />
      {/* liczy ile zxarobi w tamtym i w przyszlym miesiacu oraz ile przepracował godzin w tym ile go czeka jeszcze ile juz zaraobił */}
      <EmployeeCalcSalary />
    </div>
  );
}
