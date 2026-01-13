import { employees, users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useEffect } from "react";
import ProfileImage from "../ProfileImage/ProfileImage";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEmployeeDataContext } from "@/context/employeeContext";
type EmployeeListType = {
  employeesTabFilter: InferSelectModel<typeof employees>[];
  employeeLogInRole: string;
};

export default function EmployeeList({
  employeesTabFilter,
  employeeLogInRole,
}: EmployeeListType) {
  const pathname = usePathname();

  const { dataEmployee } = useEmployeeDataContext();

  const roleCheck = (roleVal: string, id: number, idClicked: number) => {
    const isPrivilegedRole = roleVal === "admin" || roleVal === "manager";
    const isOwnRecord = id === idClicked;

    return isPrivilegedRole || isOwnRecord;
  };
  return (
    <div>
      {employeesTabFilter.length === 0 ? (
        <p className="font-bold text-center text-teal-600">
          No Employees found
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 h-fit gap-4">
          {employeesTabFilter.map((emp, i) => {
            const commonFields = [
              { label: "role", value: emp.role },
              { label: "position", value: emp.position },
              { label: "code", value: emp.employee_code },
            ];

            const managerFields = [
              { label: "contract type", value: emp.contract_type },
              {
                label: "max consecutive days",
                value: emp.max_consecutive_days,
              },
              { label: "hours per week", value: emp.contracted_hours_per_week },
              { label: "hourly rate", value: emp.default_hourly_rate },
              { label: "status", value: emp.status },
            ];

            const fieldsToRender = [
              ...commonFields,
              ...(employeeLogInRole === "manager" ||
              employeeLogInRole === "admin"
                ? managerFields
                : []),
            ];

            return (
              <div
                key={i}
                className="w-full bg-teal-600 rounded-2xl flex items-center p-1.5 md:p-3"
              >
                <div className="bg-white h-full w-full text-teal-600 rounded-xl p-4 md:p-6 flex flex-col">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 md:mb-6">
                    <ProfileImage
                      src={emp.image || "/images/pfp-placeholder.png"}
                      size={65}
                      type={"read-only"}
                    />
                    <div>
                      <h2 className="text-lg md:text-xl font-bold break-words">
                        {emp.name}
                      </h2>
                      <h3 className="text-sm md:text-base text-teal-500 break-all">
                        {emp.email}
                      </h3>
                    </div>
                  </div>
                  <div className="flex-grow space-y-2 md:space-y-3">
                    {fieldsToRender.map((field, i) => (
                      <div
                        key={i}
                        className="text-sm md:text-base flex justify-between"
                      >
                        <span className="font-bold block sm:inline-block sm:min-w-[120px]">
                          {field.label}:
                        </span>{" "}
                        <span className="block sm:inline sm:ml-1 break-words">
                          {field.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {dataEmployee &&
                    roleCheck(employeeLogInRole, dataEmployee.id, emp.id) && (
                      <Link
                        href={`${pathname}/${emp.id}`}
                        className="text-center text-xl font-bold hover:scale-105 transition-all ease-in-out"
                      >
                        see more
                      </Link>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
