"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import useFetch from "../../hooks/useFetch";
import { useUserDataContext } from "@/context/userContext";
import { organizations } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type OrganizationType = InferSelectModel<typeof organizations>;

type DataType = [
  OrganizationType[], // pierwsza tablica orgów
  [
    {
      employees: any[];
      organizations: OrganizationType;
      schedules: any[];
    }
  ]
];

interface OrganizationContextType {
  organizationsData: OrganizationType[];
  setOrganizationsData: Dispatch<SetStateAction<OrganizationType[]>>;
  isPending: boolean;
  error: any;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export const useOrganizationContext = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganizationContext must be used within an OrganizationProvider"
    );
  }
  return context;
};

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider = ({
  children,
}: OrganizationProviderProps) => {
  const { userData } = useUserDataContext();

  const { data, isPending, error } = useFetch(
    userData?.id ? `/api/organizations/${userData.id}` : null
  );

  const [organizationsData, setOrganizationsData] = useState<
    OrganizationType[]
  >([]);

  useEffect(() => {
    if (data) {
      const typedData = data as DataType;
      
      console.log(data)

      // mapujemy i filtrujemy, żeby nie dodawać undefined
      const assignedToOrg = typedData[1]
        .map((item) => item.organizations) // bierzemy organizations
        .flatMap((org) => (Array.isArray(org) ? org : [org])); // spłaszczamy tablice i pojedyncze obiekty
      // console.log(error)
      const orgs = [...typedData[0], ...assignedToOrg];

      const uniqueOrgs = orgs.filter(
        (org, index, self) => index === self.findIndex((o) => o.id === org.id)
      );

      setOrganizationsData(uniqueOrgs);
    }
  }, [data]);

  const value: OrganizationContextType = {
    organizationsData,
    setOrganizationsData,
    isPending,
    error,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};
