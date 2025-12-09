import { employees, users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useEffect } from "react";
type EmployeeListType = {
  employeesTabFilter: InferSelectModel<typeof employees>[];
  employeeLogInRole: string;
};

export default function EmployeeList({
  employeesTabFilter,
  employeeLogInRole,
}: EmployeeListType) {
  useEffect(() => {
    console.log(employeesTabFilter);
  }, [employeesTabFilter]);


  return (
    <div>
      {employeesTabFilter.length === 0 ? (
        <p className="font-bold text-center p-5 text-teal-600">No Employees found</p>
      ) : (
        employeesTabFilter.map((emp, i) => {
          const formatDate = (date: Date) =>
            date ? new Date(date).toISOString().split("T")[0] : "";

          const commonFields = [
            { label: "role", value: emp.role },
            { label: "position", value: emp.position },
            { label: "code", value: emp.employee_code },
          ];

          const adminFields = [
            { label: "created at", value: formatDate(emp.created_at) },
            { label: "last update at", value: formatDate(emp.updated_at) },
          ];

          const managerFields = [
            { label: "contract type", value: emp.contract_type },
            { label: "max consecutive days", value: emp.max_consecutive_days },
            { label: "hours per week", value: emp.contracted_hours_per_week },
            { label: "hourly rate", value: emp.default_hourly_rate },
            { label: "status", value: emp.status },
          ];

          const fieldsToRender = [
            ...commonFields,
            ...(employeeLogInRole === "admin" ? adminFields : []),
            ...(employeeLogInRole === "manager" || employeeLogInRole === "admin"
              ? managerFields
              : []),
          ];

          return (
            <div key={i} className="w-full">
              <h2 className="text-xl text-teal-600 mb-5 m-2">
                {emp.name} {emp.email}
              </h2>
              <div className="grid w-full grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-2 p-2 items-center justify-between">
                {fieldsToRender.map((field, idx) => (
                  <p key={idx}>
                    <span className="font-bold">{field.label}:</span>{" "}
                    {field.value}
                  </p>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
