"use client";
import useFetch from "@/hooks/useFetch";
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { users } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";


type User = InferSelectModel<typeof users>;

interface UserDataContextType {
  userData: User | null;
  error: string | null;
  isPending: boolean;
  isAdmin:boolean | undefined;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export const useUserDataContext = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error(
      "useUserDataContext must be used within a UserDataProvider"
    );
  }
  return context;
};

interface UserDataProviderProps {
  children: ReactNode;
}

export const UserDataProvider = ({ children }: UserDataProviderProps) => {
  const { error, isPending, data } = useFetch<User>(`/api/users/me`);

  const value: UserDataContextType = {
    userData: data,
    error: error,
    isPending: isPending,
    isAdmin: data?.is_admin
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
