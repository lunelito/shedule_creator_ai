import { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import {
  employees,
  schedule_swap_requests,
  schedules,
  schedules_day,
  time_off_requests,
} from "@/db/schema";

type UseScheduleFetchProps = {
  scheduleId: string | number | null;
};

export type scheduleSwapRequestsFetchedType = {
  employeeRecive: InferSelectModel<typeof employees>;
  employeeRequest: InferSelectModel<typeof employees>;
  scheduleDayRecive: InferSelectModel<typeof schedules_day>;
  scheduleDayRequest: InferSelectModel<typeof schedules_day>;
  scheduleSwapRequest: InferSelectModel<typeof schedule_swap_requests>;
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

  const [scheduleSwapRequestsFetched, setScheduleSwapRequestsFetched] =
    useState<scheduleSwapRequestsFetchedType[]>([]);

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
    data: dataScheduleSwapRequests,
    isPending: isPendingScheduleSwapRequests,
    error: errorScheduleSwapRequests,
  } = useFetch<scheduleSwapRequestsFetchedType[]>(
    ` /api/schedule_swap_requests`,
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
    if (dataScheduleSwapRequests) {
      setScheduleSwapRequestsFetched(dataScheduleSwapRequests);
    }
  }, [dataScheduleSwapRequests]);

  useEffect(() => {
    if (dataSingleScheduleDay) {
      setDataSingleScheduleDayFetched(dataSingleScheduleDay);
    }
  }, [dataSingleScheduleDay]);

  const isPending =
    isPendingSchedule ||
    isPendingEmployees ||
    isPendingSingleScheduleDay ||
    isPendingScheduleSwapRequests ||
    isTimeOffRequests;

  const error =
    errorSchedule ||
    errorEmployees ||
    errorScheduleSwapRequests ||
    errorSingleScheduleDay ||
    errorTimeOffRequests;

  return {
    employeesTabFetched,
    timeOffRequestsDataFetched,
    dataScheduleFetched,
    scheduleSwapRequestsFetched,
    dataSingleScheduleDayFetched,
    isPending,
    error,
    setEmployeesTabFetched,
    setTimeOffRequestsDataFetched,
    setDataScheduleFetched,
    setDataSingleScheduleDayFetched,
    setScheduleSwapRequestsFetched,
  };
}
