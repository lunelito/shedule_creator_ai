"use client";
import RenderAnimation from "@/animations/RenderAnimation";
import { OrganizationType } from "@/context/organizationsContext";
import { useUserDataContext } from "@/context/userContext";
import useFetch from "../../../../lib/hooks/useFetch";
import Link from "next/link";
import { useParams } from "next/navigation";
import Loader from "@/components/UI/Loader";
import DashboardHeader from "@/components/UI/DashboardHeader";
import { schedules } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import ScheduleCard from "@/components/SchedulesPage/Schedule/ScheduleCards/ScheduleCard";
import AddNewScheduleCard from "@/components/SchedulesPage/Schedule/ScheduleCards/AddNewScheduleCard";
import { useRef, useState } from "react";

export default function SchedulePage() {
  const params = useParams();
  const { userData } = useUserDataContext();
  const userId = userData?.id;
  const organizationId = params.organizationId;
  const scheduleCardRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState<number>(0);

  const {
    data: dataOrganization,
    isPending: isPendingOrganization,
    error: errorOrganization,
  } = useFetch(
    userId ? `/api/organizations/${userId}/${organizationId}` : null,
  );

  const organization = dataOrganization as OrganizationType;

  const {
    data: dataSchedule,
    isPending: isPendingSchedule,
    error: errorSchedule,
  } = useFetch<InferSelectModel<typeof schedules>[]>(
    userId ? `/api/schedules/${userId}/${organizationId}` : null,
  );

  if (
    isPendingOrganization ||
    isPendingSchedule ||
    !organization ||
    !dataSchedule
  ) {
    return <Loader />;
  }

  if (errorOrganization || errorSchedule) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-red-500">Error loading organization</p>
      </div>
    );
  }

  // console.log(containerSize,typeof containerSize)

  return (
    <div className="flex flex-col w-full">
      <DashboardHeader title={organization.name} />
      <RenderAnimation animationKey={organizationId as string}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 p-10 items-start">
          {dataSchedule.map((el, i) => (
            <ScheduleCard
              id={el.id}
              organizationId={organizationId}
              key={el.id}
              name={el.name}
              setContainerSize={setContainerSize}
              scheduleCardRef={scheduleCardRef}
            />
          ))}
          <AddNewScheduleCard organizationId={organizationId} containerSize={containerSize}/>
        </div>
      </RenderAnimation>
    </div>
  );
}
