import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useEffect, useState } from "react";

type EmployeeFilterTyep = {
  employeesTab: InferSelectModel<typeof employees>[];
  setEmployeesTabFilter: React.Dispatch<
    React.SetStateAction<InferSelectModel<typeof employees>[]>
  >;
};

export default function EmployeeFilter({
  employeesTab,
  setEmployeesTabFilter,
}: EmployeeFilterTyep) {
  const [uniquePositions, setUniquePositions] = useState<string[]>(["all"]);
  const roles = ["admin", "manager", "supervisor", "employee"];

  useEffect(() => {
    const uniquePositionsList = employeesTab.map((el) =>
      el.position !== null ? el.position : ""
    );
    const mySet = new Set(uniquePositionsList);

    setUniquePositions((prev) => Array.from(new Set([...prev, ...mySet])));
  }, [employeesTab]);

  const filterEmployeesData = (value: string) => {
    if (value === "all") {
      setEmployeesTabFilter(employeesTab); // oryginał
    } else if (roles.includes(value)) {
      setEmployeesTabFilter(employeesTab.filter((emp) => emp.role === value));
    } else {
      setEmployeesTabFilter(
        employeesTab.filter((emp) => emp.position === value)
      );
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 items-center gap-8">
      {uniquePositions.map((el, i) => (
        <div
          key={i}
          onClick={() => filterEmployeesData(el)}
          className="flex items-center justify-center p-3 rounded border-1 hover:scale-105 transition-all ease-in-out hover:bg-teal-600 hover:border-teal-600"
        >
          {el}
        </div>
      ))}
      {roles.map((el, i) => (
        <div
          key={i}
          onClick={() => filterEmployeesData(el)}
          className="flex items-center justify-center p-3 rounded border-1 hover:scale-105 transition-all ease-in-out hover:bg-teal-600 hover:border-teal-600"
        >
          {el}
        </div>
      ))}
    </div>
  );
}
