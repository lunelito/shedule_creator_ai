"use client";
import DashboardHeader from "@/components/UI/DashboardHeader";
import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import useFetch from "../../../../../../../hooks/useFetch";
import Loader from "@/components/UI/Loader";

export default function page() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.employeeId;
  const scheduleId = params.scheduleId;
  console.log(employeeId, scheduleId);

  const {
    data: dataEmployee,
    isPending: isPendingEmployee,
    error: errorEmployee,
  } = useFetch<InferSelectModel<typeof employees>>(
    `/api/employees/${employeeId}`
  );

  const {
    data: dataSingleScheduleDayOfEmployee,
    isPending: isPendingSingleScheduleDayOfEmployee,
    error: errorSingleScheduleDayOfEmployee,
  } = useFetch<InferSelectModel<typeof employees>>(
    `/api/schedules_day/${scheduleId}/${employeeId}`
  );

  console.log(dataSingleScheduleDayOfEmployee);

  if (errorSingleScheduleDayOfEmployee || errorEmployee) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-red-500">Error loading employee data</p>
      </div>
    );
  }

  if (
    isPendingSingleScheduleDayOfEmployee ||
    isPendingEmployee ||
    !dataEmployee ||
    !dataSingleScheduleDayOfEmployee
  ) {
    return <Loader />;
  }

  console.log(dataSingleScheduleDayOfEmployee,dataEmployee)

  return (
    <div>
      <DashboardHeader
        onClick={() => router.back()}
        title={dataEmployee.name ?? ""}
      />
    </div>
  );
}
