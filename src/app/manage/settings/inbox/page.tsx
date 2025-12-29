"use client";
import React, { useEffect, useState } from "react";
import useFetch from "../../../../../hooks/useFetch";
import { useUserDataContext } from "@/context/userContext";
import { InferSelectModel } from "drizzle-orm";
import { employees, organizations, schedules } from "@/db/schema";
import DashboardHeader from "@/components/UI/DashboardHeader";
import { useRouter } from "next/navigation";
import InboxList from "@/components/inbox/InboxList";
import SingleInviteItem from "@/components/inbox/SingleInviteItem";
import Loader from "@/components/UI/Loader";
export type inviteDatatype = {
  when: string;
  role: string;
  position: string;
  organization: string;
  schedule: string;
  schedule_id: number;
  organization_id: number;
  employee_id: number;
  user_id: number;
};

export type inviteFetchType = {
  schedules: InferSelectModel<typeof schedules>;
  organizations: InferSelectModel<typeof organizations>;
  employees: InferSelectModel<typeof employees>;
};

export default function page() {
  const [inviteData, setInviteData] = useState<inviteDatatype[]>([]);
  const [organizationsTab, setOrganizationsTab] = useState<
    InferSelectModel<typeof organizations>[]
  >([]);
  const { userData } = useUserDataContext();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const { data, isPending } = useFetch<inviteFetchType[]>(
    userData?.id ? `/api/inbox/${userData?.id}` : null
  );
  useEffect(() => {
    if (!data) return;
    const tempTabInvite: inviteDatatype[] = [];
    const tempTabOrg: InferSelectModel<typeof organizations>[] = [];

    data.map((el, i) => {
      const tempData = {
        when: new Date(el.employees?.created_at)
          .toISOString()
          .split("T")[0] as string,
        role: el.employees?.role as string,
        position: el.employees?.position as string,
        organization: el.organizations?.name,
        schedule: el.schedules?.name,
        schedule_id: el.schedules?.id,
        organization_id: el.organizations?.id,
        employee_id: el.employees?.id,
        user_id: userData?.id!,
      };
      tempTabInvite.push(tempData);
      tempTabOrg.push(el.organizations);
    });

    const uniqueTabOrg = tempTabOrg.filter(
      (item, index, array) => array.findIndex((i) => i.id === item.id) === index
    );
    setOrganizationsTab((prev) => [...prev, ...uniqueTabOrg]);
    setInviteData((prev) => [...prev, ...tempTabInvite]);
  }, [data]);
  
  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="w-full flex flex-col">
      <DashboardHeader
        title="inbox"
        onClick={() => router.back()}
        error={error}
      />
      {inviteData.length === 0 ? (
        <div className="p-10 h-full w-full flex justify-center items-center">
          <p className="text-2xl font-bold ">No invites here!</p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 p-10 gap-5 overflow-y-auto scrollbar-none">
          {inviteData.map((invite, i) => (
            <SingleInviteItem
              organization={organizationsTab}
              setError={setError}
              invite={invite}
              key={invite.employee_id}
              setInviteData={setInviteData}
            />
          ))}
        </div>
      )}
    </div>
  );
}
