import { employees, users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { SetStateAction, useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import EmployeeFilter from "./EmployeeFilter";
import EmployeeAddForm from "./EmployeeAddForm";
import EmployeeList from "./EmployeeList";
import { ParamValue } from "next/dist/server/request/params";
import { AnimatePresence } from "framer-motion";
import FadeAnimation from "@/animations/FadeAnimation";

type EmployeesDatalistType = {
  employeesTab: InferSelectModel<typeof employees>[];
  employeeLogInRole: string;
  scheduleId: ParamValue;
};

export default function EmployeesDatalist({
  employeesTab,
  employeeLogInRole,
  scheduleId,
}: EmployeesDatalistType) {
  const [error, setError] = useState("");

  const [employeesTabFilter, setEmployeesTabFilter] = useState<
    InferSelectModel<typeof employees>[]
  >([]);

  useEffect(() => {
    if (employeesTab) {
      setEmployeesTabFilter(employeesTab);
    }
  }, [employeesTab]);

  return (
    <div className="w-[90%] h-full">
      <div className="w-full h-fit flex flex-col gap-25">
        <div>
          <h2 className="p-2 text-2xl font-bold mb-2">Filter Employees:</h2>
          <EmployeeFilter
            employeeLogInRole={employeeLogInRole}
            employeesTab={employeesTab}
            setEmployeesTabFilter={setEmployeesTabFilter}
          />
        </div>
        <div>
          <h2 className="p-2 text-2xl font-bold mb-2">Employees:</h2>
          <EmployeeList
            employeeLogInRole={employeeLogInRole}
            employeesTabFilter={employeesTabFilter}
          />
        </div>
        <div>
          {employeeLogInRole === "admin" && (
            <div>
              <div className="flex justify-between">
                <h2 className="p-2 text-2xl font-bold mb-2">Add Employees:</h2>
                <AnimatePresence mode="wait">
                  {error && (
                    <FadeAnimation
                      animationKey={`errorMessage-${error?.[0] || "unknown"}`}
                    >
                      <p className="text-[clamp(1rem,6vw,2rem)] font-bold text-teal-600">
                        {error}!
                      </p>
                    </FadeAnimation>
                  )}
                </AnimatePresence>
              </div>
              <EmployeeAddForm
                scheduleId={scheduleId}
                setError={setError}
                setEmployeesTabFilter={setEmployeesTabFilter}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
