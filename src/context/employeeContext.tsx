"use client";

import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useSession } from "next-auth/react";
import React, { createContext, useContext } from "react";
import useFetch from "../lib/hooks/useFetch";
import { useParams, useSearchParams } from "next/navigation";

type Employee = InferSelectModel<typeof employees>;

interface EmployeeDataContextType {
  dataEmployee: Employee | null;
  errorEmployee: string | null;
  isPendingEmployee: boolean;
  role: string | undefined;
}

const EmployeeDataContext = createContext<EmployeeDataContextType | undefined>(
  undefined,
);

export const useEmployeeDataContext = () => {
  const context = useContext(EmployeeDataContext);
  if (!context)
    throw new Error(
      "useEmployeeDataContext must be used within a EmployeeDataProvider",
    );
  return context;
};

export const EmployeeDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const params = useParams();
  const searchParams = useSearchParams();
  const scheduleId_SearchParams = searchParams.get("schedule_id");
  const scheduleId_Params = params.scheduleId;

  const scheduleId = scheduleId_SearchParams || scheduleId_Params;

  const userId = (session?.user as any)?.id;
  const url = userId && scheduleId ? "/api/employees/me/" + scheduleId : null;

  const { data, error, isPending } = useFetch<Employee>(url);

  const value: EmployeeDataContextType = {
    dataEmployee: data,
    errorEmployee: error,
    isPendingEmployee: isPending,
    role: data?.role,
  };

  return (
    <EmployeeDataContext.Provider value={value}>
      {children}
    </EmployeeDataContext.Provider>
  );
};
