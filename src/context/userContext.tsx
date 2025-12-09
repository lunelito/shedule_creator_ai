"use client";
import useFetch from "../../hooks/useFetch";
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { users } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { useSession } from "next-auth/react";

type User = InferSelectModel<typeof users>;

interface UserDataContextType {
  userData: User | null;
  error: string | null;
  isPending: boolean;
  isAdmin: boolean | undefined;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export const useUserDataContext = () => {
  const context = useContext(UserDataContext);
  if (!context)
    throw new Error(
      "useUserDataContext must be used within a UserDataProvider"
    );
  return context;
};

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();

  const userId = (session?.user as any)?.id;
  const url = userId ? "/api/user/me" : null;

  const { data, error, isPending } = useFetch<User>(url);

  const value: UserDataContextType = {
    userData: data,
    error,
    isPending,
    isAdmin: data?.is_admin,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
