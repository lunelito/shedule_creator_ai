import { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import {
  employees,
  schedules,
  schedules_day,
  time_off_requests,
} from "@/db/schema";

type UseScheduleFetchProps = {
  scheduleId: string | number | null;
};

export function useScheduleFetch({ scheduleId }: UseScheduleFetchProps) {
  const [dataScheduleFetched, setDataScheduleFetched] = useState<
    InferSelectModel<typeof schedules>
  >({} as InferSelectModel<typeof schedules>);

  const [employeesTabFetched, setEmployeesTabFetched] = useState<
    InferSelectModel<typeof employees>[]
  >([]);

  const [timeOffRequestsDataFetched, setTimeOffRequestsDataFetched] = useState<
    InferSelectModel<typeof time_off_requests>[]
  >([]);

  const [dataSingleScheduleDayFetched, setDataSingleScheduleDayFetched] =
    useState<InferSelectModel<typeof schedules_day>[]>([]);

  const {
    data: dataSchedule,
    isPending: isPendingSchedule,
    error: errorSchedule,
  } = useFetch<InferSelectModel<typeof schedules>>(
    `/api/schedules/${scheduleId}`,
  );

  const {
    data: dataEmployees,
    isPending: isPendingEmployees,
    error: errorEmployees,
  } = useFetch<InferSelectModel<typeof employees>[]>(
    `/api/employees?id=${scheduleId}`,
  );

  const {
    data: dataSingleScheduleDay,
    isPending: isPendingSingleScheduleDay,
    error: errorSingleScheduleDay,
  } = useFetch<InferSelectModel<typeof schedules_day>[]>(
    `/api/schedules_day/${scheduleId}`,
  );

  const {
    data: dataTimeOffRequests,
    isPending: isTimeOffRequests,
    error: errorTimeOffRequests,
  } = useFetch<InferSelectModel<typeof time_off_requests>[]>(
    ` /api/time-off-request/${scheduleId} `,
  );

  useEffect(() => {
    if (dataSchedule) {
      setDataScheduleFetched(dataSchedule);
    }
  }, [dataSchedule]);

  useEffect(() => {
    if (dataEmployees) {
      setEmployeesTabFetched(dataEmployees);
    }
  }, [dataEmployees]);

  useEffect(() => {
    if (dataTimeOffRequests) {
      setTimeOffRequestsDataFetched(dataTimeOffRequests);
    }
  }, [dataTimeOffRequests]);

  useEffect(() => {
    if (dataSingleScheduleDay) {
      setDataSingleScheduleDayFetched(dataSingleScheduleDay);
    }
  }, [dataSingleScheduleDay]);

  const isPending =
    isPendingSchedule ||
    isPendingEmployees ||
    isPendingSingleScheduleDay ||
    isTimeOffRequests;

  const error =
    errorSchedule ||
    errorEmployees ||
    errorSingleScheduleDay ||
    errorTimeOffRequests;

  return {
    employeesTabFetched,
    timeOffRequestsDataFetched,
    dataScheduleFetched,
    dataSingleScheduleDayFetched,
    isPending,
    error,
    setEmployeesTabFetched,
    setTimeOffRequestsDataFetched,
    setDataScheduleFetched,
    setDataSingleScheduleDayFetched,
  };
}
