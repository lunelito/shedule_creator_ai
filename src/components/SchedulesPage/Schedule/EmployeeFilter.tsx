import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useEffect, useState } from "react";

type EmployeeFilterTyep = {
  employeesTab: InferSelectModel<typeof employees>[];
  setEmployeesTabFilter: React.Dispatch<
    React.SetStateAction<InferSelectModel<typeof employees>[]>
  >;
  employeeLogInRole: string;
};

export default function EmployeeFilter({
  employeesTab,
  setEmployeesTabFilter,
  employeeLogInRole,
}: EmployeeFilterTyep) {
  const [uniquePositions, setUniquePositions] = useState<string[]>(["all"]);
  const roles = ["admin", "manager", "supervisor", "employee"];
  const schedule_invite = ["declined", "accepted", "waiting"];

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
    } else if (schedule_invite.includes(value)) {
      setEmployeesTabFilter(
        employeesTab.filter((emp) => emp.accept_to_schedule === value)
      );
    } else {
      setEmployeesTabFilter(
        employeesTab.filter((emp) => emp.position === value)
      );
    }
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 max-h-[30vh] overflow-auto lg:grid-cols-6 xl:grid-cols-8 p-2 items-center gap-8 text-[clamp(0.75rem,1vw,1rem)] text-center">
      {[
        ...uniquePositions,
        ...roles,
        ...(employeeLogInRole === "admin" ? schedule_invite : []),
      ].map((el, i) => (
        <div
          key={el}
          onClick={() => filterEmployeesData(el)}
          className="flex items-center aspect-[2/1] px-3 py-2 justify-center cursor-pointer rounded border-1 hover:scale-105 transition-all ease-in-out hover:bg-teal-600 hover:border-teal-600"
        >
          {el}
        </div>
      ))}
    </div>
  );
}
