"use client";
import RenderAnimation from "@/animations/RenderAnimation";
import { OrganizationType } from "@/context/organizationsContext";
import { useUserDataContext } from "@/context/userContext";
import useFetch from "../../../../lib/hooks/useFetch";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ClipLoader, HashLoader, MoonLoader } from "react-spinners";
import Loader from "@/components/UI/Loader";
import DashboardHeader from "@/components/UI/DashboardHeader";

export default function SchedulePage() {
  const params = useParams();
  const { userData } = useUserDataContext();
  const userId = userData?.id;
  const organizationId = params.organizationId;

  const {
    data: dataOrganization,
    isPending: isPendingOrganization,
    error: errorOrganization,
  } = useFetch(
    userId ? `/api/organizations/${userId}/${organizationId}` : null
  );

  const organization = dataOrganization as OrganizationType;

  const {
    data: dataSchedule,
    isPending: isPendingSchedule,
    error: errorSchedule,
  } = useFetch<[]>(
    userId ? `/api/schedules/${userId}/${organizationId}` : null
  );

  if (isPendingOrganization || isPendingSchedule || !organization) {
    return <Loader />;
  }

  if (errorOrganization || errorSchedule) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-red-500">Error loading organization</p>
      </div>
    );
  }

  const showSchedulesPlusCreateOne = [
    ...(dataSchedule ?? []),
    { name: "Create New Schedule", id: "create" },
  ];

  return (
    <div className="flex flex-col w-full">
      <DashboardHeader title={organization.name} />
      <RenderAnimation animationKey={organizationId as string}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-10">
          {showSchedulesPlusCreateOne.map((el, i) => (
            <Link
              key={el.name}
              className="border-2 border-gray-200 p-4 md:p-6 rounded-xl md:rounded-2xl text-lg md:text-xl hover:border-teal-600 hover:bg-teal-600 transition-all duration-200 text-center"
              href={
                el.id === "create"
                  ? `/manage/add/schedule?organizationId=${organizationId}`
                  : `/manage/organization/${organizationId}/${el.id}`
              }
            >
              {el.name}
            </Link>
          ))}
        </div>
      </RenderAnimation>
    </div>
  );
}
