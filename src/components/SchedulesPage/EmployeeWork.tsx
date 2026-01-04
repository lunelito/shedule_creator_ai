import { employees, schedules_day } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SingleEmployeeWorkCard from "./SingleEmployeeWorkCard";

type EmployeeWorktype = {
  employeesTab: InferSelectModel<typeof employees>[];
  dataSingleScheduleDay: InferSelectModel<typeof schedules_day>[];
  employeeLogInRole: string;
};

export default function EmployeeWork({
  employeesTab,
  dataSingleScheduleDay,
  employeeLogInRole,
}: EmployeeWorktype) {
  const format = (d: Date) => d.toISOString().split("T")[0];

  const today = new Date();

  const todayDate = format(today);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDate = format(tomorrow);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayDate = format(yesterday);

  const getIdsByDate = (targetDate: string) =>
    dataSingleScheduleDay
      .filter((day) => format(new Date(day.end_at)) === targetDate)
      .map((day) => day.assigned_employee_id);

  const idsToday = getIdsByDate(todayDate);
  const idsYesterday = getIdsByDate(yesterdayDate);
  const idsTomorrow = getIdsByDate(tomorrowDate);

  const todayEmployees = employeesTab.filter((emp) =>
    idsToday.includes(emp.id)
  );

  const yesterdayEmployees = employeesTab.filter((emp) =>
    idsYesterday.includes(emp.id)
  );

  const tomorrowEmployees = employeesTab.filter((emp) =>
    idsTomorrow.includes(emp.id)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-5 h-[40vh]">
      <SingleEmployeeWorkCard
        employeeLogInRole={employeeLogInRole}
        tab={yesterdayEmployees}
        title={"Yesterday employees on shift"}
      />
      <SingleEmployeeWorkCard
        employeeLogInRole={employeeLogInRole}
        tab={todayEmployees}
        title={"Today employees on shift"}
      />
      <SingleEmployeeWorkCard
        employeeLogInRole={employeeLogInRole}
        tab={tomorrowEmployees}
        title={"Tommorow employees on shift"}
      />
    </div>
  );
}
