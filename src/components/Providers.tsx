"use client";

import { EmployeeDataProvider } from "@/context/employeeContext";
import { OrganizationProvider } from "@/context/organizationsContext";
import { UserDataProvider } from "@/context/userContext";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <UserDataProvider>
        <EmployeeDataProvider>
          <OrganizationProvider>{children}</OrganizationProvider>
        </EmployeeDataProvider>
      </UserDataProvider>
    </NextAuthSessionProvider>
  );
}
