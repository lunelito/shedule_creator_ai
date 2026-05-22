import React from "react";
import { DayEmployees } from "./ScheduleCard";

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
      {employeesPerDay.map((el) => (
        <div className="flex flex-col items-center gap-1.5" key={el.name}>
          <div className=" flex flex-col gap-1 ">
            {Array.from({
              length: getColorByEmployeeNum(el.employees),
            }).map((_, i) => (
              <div
                className={`w-3 h-3 rounded-full ${colors.get(i)}`}
                key={i}
              />
            ))}
            {Array.from({
              length: 6 - getColorByEmployeeNum(el.employees),
            }).map((_, i) => (
              <div className="w-3 h-3 bg-zinc-600 rounded-full" key={i} />
            ))}
          </div>
          <p className="text-sm ">{el.name}</p>
          <p className="text-sm ">{el.employees}</p>
        </div>
      ))}
    </div>
  );
}
