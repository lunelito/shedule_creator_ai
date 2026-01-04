import ProfileImage from "@/components/ProfileImage/ProfileImage";
import { employees, schedules_day } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { SetStateAction } from "react";
import EmployeeNote from "./EmployeeNote";

type EmployeeDetailsType = {
  setEmployeesFetched: React.Dispatch<
    SetStateAction<InferSelectModel<typeof employees>[]>
  >;
  dataEmployee: InferSelectModel<typeof employees>;
  dataEmployees: InferSelectModel<typeof employees>[];
  setError: React.Dispatch<SetStateAction<string>>;
};

export default function EmployeeDetails({
  dataEmployee,
  dataEmployees,
  setEmployeesFetched,
  setError,
}: EmployeeDetailsType) {
  const countAsManySameRole = dataEmployees.reduce((acc, cur) => {
    if (cur.position == dataEmployee.position) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 p-4 md:p-6 lg:p-10 pt-10 h-fit w-full gap-4 md:gap-6 lg:gap-10">
      <div className="flex flex-col lg:flex-row lg:justify-between bg-zinc-700 rounded-lg p-4 lg:col-span-2">
        <div className="w-full lg:w-3/4 border-b-2 pb-4 lg:pb-0 lg:pr-8 lg:border-r-2 lg:border-b-0 border-zinc-600">
          <h2 className="text-2xl font-bold text-white mb-4">Employee Data</h2>

          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-gray-300 min-w-28">Email:</span>
              <span className="text-white font-medium">
                {dataEmployee.email}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-300 min-w-28">Contract:</span>
              <span className="text-white font-medium capitalize">
                {dataEmployee.contract_type}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-300 min-w-28">Position:</span>
              <span className="text-white font-medium">
                {dataEmployee.role}
              </span>
            </div>

            <div className="pt-2 border-t border-zinc-600 mt-4">
              <div className="flex items-start">
                <span className="text-gray-300 min-w-28">Availability:</span>
                <span className="text-white font-medium">
                  Max{" "}
                  <span className="text-teal-300">
                    {dataEmployee.max_consecutive_days}
                  </span>{" "}
                  consecutive days
                </span>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-gray-300 min-w-28">Title:</span>
              <span className="text-white font-medium">
                {dataEmployee.position}
              </span>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-600">
              <div className="flex items-start">
                <span className="text-gray-300 min-w-28">Note:</span>
                <span
                  className={`font-medium ${
                    countAsManySameRole == 1 ? "text-teal-600" : "text-white"
                  }`}
                >
                  {countAsManySameRole == 1
                    ? "Your only employee in this role - keep them happy!"
                    : `You have ${countAsManySameRole} employees in this position.`}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center pt-4 lg:pt-0 lg:pl-4 w-full lg:w-1/4">
          <ProfileImage
            src={dataEmployee.image || "/images/pfp-placeholder.png"}
            size={140}
            type={"read-only"}
          />
        </div>
      </div>
      <div className="bg-teal-600 rounded-lg p-4 h-64 lg:h-full">
        <EmployeeNote
          setEmployeesFetched={setEmployeesFetched}
          fetchedNote={dataEmployee.note}
          employee_id={dataEmployee.id}
          setError={setError}
        />
      </div>
    </div>
  );
}
