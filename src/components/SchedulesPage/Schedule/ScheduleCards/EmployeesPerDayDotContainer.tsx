import { DayEmployees } from "@/app/manage/organization/[organizationId]/page";
import React from "react";

type EmployeesPerDayDotContainer = {
  colors: Map<number, string>;
  employeesPerDay: DayEmployees[];
  getColorByEmployeeNum: (num: number) => 6 | 4 | 2 | 1 | 3 | 5;
};

export default function EmployeesPerDayDotContainer({
  colors,
  employeesPerDay,
  getColorByEmployeeNum,
}: EmployeesPerDayDotContainer) {
  return (
    <div className="grid grid-cols-7 w-full">
      {employeesPerDay.map((el) => {
        console.log(el.employeeCount)
        return (
          <div className="flex flex-col items-center gap-1.5" key={el.date}>
            <div className="flex flex-col gap-1 ">
              {Array.from({
                length: getColorByEmployeeNum(el.employeeCount),
              }).map((_, i) => (
                <div
                  className={`w-3 h-3 rounded-full ${colors.get(i)}`}
                  key={i}
                />
              ))}
              {Array.from({
                length: 6 - getColorByEmployeeNum(el.employeeCount),
              }).map((_, i) => (
                <div className="w-3 h-3 bg-zinc-600 rounded-full" key={i} />
              ))}
            </div>
            <p className="text-sm ">{el.date}</p>
            <p className="text-sm ">{el.employeeCount}</p>
          </div>
        );
      })}
    </div>
  );
}
