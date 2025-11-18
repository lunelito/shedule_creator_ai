"use client";

import { OrganizationProvider } from "@/context/organizationsContext";
import { UserDataProvider } from "@/context/userContext";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <UserDataProvider>
        <OrganizationProvider>{children}</OrganizationProvider>
      </UserDataProvider>
    </NextAuthSessionProvider>
  );
}
