"use client";
import RenderAnimation from "@/animations/RenderAnimation";
import { OrganizationType } from "@/context/organizationsContext";
import { useUserDataContext } from "@/context/userContext";
import useFetch from "../../../../../hooks/useFetch";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SchedulePage() {
  const params = useParams();
  const { userData } = useUserDataContext();
  const userId = userData?.id;
  const organizationId = params.organizationId;
  const { data, isPending, error } = useFetch(
    `/api/organizations/${userId}/${organizationId}`
  );

  const organization = data as OrganizationType;

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-red-500">Error loading organization</p>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p>Organization not found</p>
      </div>
    );
  }

  const scheduleDemo = [
    { name: "Schedule 1", id: 1 },
    { name: "Schedule 2", id: 2 },
  ];

  const showSchedulesPlusCreateOne = [
    ...scheduleDemo,
    { name: "Create New Schedule", id: "create" },
  ];

  return (
    <RenderAnimation animationKey={organizationId as string}>
      <div className="flex flex-col gap-10 p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          {organization.name} - Schedules
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {showSchedulesPlusCreateOne.map((el, i) => (
            <Link
              key={el.id}
              className="border-2 border-gray-200 p-4 md:p-6 rounded-xl md:rounded-2xl text-lg md:text-xl hover:border-teal-600 hover:bg-teal-600 transition-all duration-200 text-center"
              href={
                el.id === "create"
                  ? `/manage/add/schedule`
                  : `/manage/organization/${organizationId}/${el.id}`
              }
            >
              {el.name}
            </Link>
          ))}
        </div>
      </div>
    </RenderAnimation>
  );
}
