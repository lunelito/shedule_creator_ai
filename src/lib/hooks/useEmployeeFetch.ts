import { InferSelectModel } from "drizzle-orm";
import { useEffect, useMemo, useState } from "react";
import useFetch from "./useFetch";
import { employees, schedules_day, time_off_requests } from "@/db/schema";

type UseEmployeeFetchProps = {
  scheduleId: string | number | null;
  employeeId: string | number | null;
};

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export function useEmployeeFetch({
  scheduleId,
  employeeId,
}: UseEmployeeFetchProps) {
  const { pastMonth, presentMonth, futureMonth } = useMemo(() => {
    const today = new Date();

    return {
      pastMonth: formatDate(
        new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
      ),
      presentMonth: formatDate(today),
      futureMonth: formatDate(
        new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
      ),
    };
  }, []);

  const [employeesFetched, setEmployeesFetched] = useState<
    InferSelectModel<typeof employees>[]
  >([]);

  const [employeeFetched, setEmployeeFetched] = useState<
    InferSelectModel<typeof employees>
  >({} as InferSelectModel<typeof employees>);

  const [singleScheduleDayFetched, setSingleScheduleDayFetched] = useState<
    InferSelectModel<typeof schedules_day>[]
  >([]);

  const [threeMonthScheduleDayFetched, setThreeMonthScheduleDayFetched] =
    useState<InferSelectModel<typeof schedules_day>[][]>([]);

  const [threeMonthScheduleDayAllFetched, setThreeMonthScheduleDayAllFetched] =
    useState<InferSelectModel<typeof schedules_day>[][]>([]);

  const [timeOffRequestsFetched, setTimeOffRequestsFetched] = useState<
    InferSelectModel<typeof time_off_requests>[]
  >([]);

  const {
    data: dataEmployees,
    isPending: isPendingEmployees,
    error: errorEmployees,
  } = useFetch<InferSelectModel<typeof employees>[]>(
    `/api/employees?id=${scheduleId}`,
  );

  const {
    data: dataSingleScheduleDayOfEmployee,
    isPending: isPendingSingleScheduleDayOfEmployee,
    error: errorSingleScheduleDayOfEmployee,
  } = useFetch<InferSelectModel<typeof schedules_day>[]>(
    `/api/schedules_day/${scheduleId}/${employeeId}`,
  );

  const {
    data: dataThreeMonthScheduleDay,
    isPending: isPendingThreeMonthScheduleDay,
    error: errorThreeMonthScheduleDay,
  } = useFetch<InferSelectModel<typeof schedules_day>[][]>(
    `/api/schedules_day/${scheduleId}/${employeeId}?presentMonth=${presentMonth}&pastMonth=${pastMonth}&futureMonth=${futureMonth}`,
  );

  const {
    data: dataThreeMonthScheduleDayAll,
    isPending: isPendingThreeMonthScheduleDayAll,
    error: errorThreeMonthScheduleDayAll,
  } = useFetch<InferSelectModel<typeof schedules_day>[][]>(
    `/api/schedules_day/${scheduleId}?presentMonth=${presentMonth}&pastMonth=${pastMonth}&futureMonth=${futureMonth}`,
  );

  const {
    data: dataTimeOffRequests,
    isPending: isPendingTimeOffRequests,
    error: errorTimeOffRequests,
  } = useFetch<InferSelectModel<typeof time_off_requests>[]>(
    `/api/time-off-request/${scheduleId}/${employeeId}`,
  );

  useEffect(() => {
    if (dataEmployees) {
      setEmployeesFetched(dataEmployees);
      setEmployeeFetched(
        dataEmployees.filter((el) => el.id === Number(employeeId))[0],
      );
    }
  }, [dataEmployees]);

  useEffect(() => {
    if (dataSingleScheduleDayOfEmployee) {
      setSingleScheduleDayFetched(dataSingleScheduleDayOfEmployee);
    }
  }, [dataSingleScheduleDayOfEmployee]);

  useEffect(() => {
    if (dataThreeMonthScheduleDay) {
      setThreeMonthScheduleDayFetched(dataThreeMonthScheduleDay);
    }
  }, [dataThreeMonthScheduleDay]);

  useEffect(() => {
    if (dataThreeMonthScheduleDayAll) {
      setThreeMonthScheduleDayAllFetched(dataThreeMonthScheduleDayAll);
    }
  }, [dataThreeMonthScheduleDayAll]);

  useEffect(() => {
    if (dataTimeOffRequests) {
      setTimeOffRequestsFetched(dataTimeOffRequests);
    }
  }, [dataTimeOffRequests]);

  const isPending =
    isPendingEmployees ||
    isPendingSingleScheduleDayOfEmployee ||
    isPendingThreeMonthScheduleDay ||
    isPendingThreeMonthScheduleDayAll ||
    isPendingTimeOffRequests;

  const error =
    errorEmployees ||
    errorSingleScheduleDayOfEmployee ||
    errorThreeMonthScheduleDay ||
    errorThreeMonthScheduleDayAll ||
    errorTimeOffRequests;

  return {
    employeesFetched,
    employeeFetched,
    singleScheduleDayFetched,
    threeMonthScheduleDayFetched,
    threeMonthScheduleDayAllFetched,
    timeOffRequestsFetched,
    isPending,
    error,
    presentMonth,
    setEmployeesFetched,
    setEmployeeFetched,
    setSingleScheduleDayFetched,
    setThreeMonthScheduleDayFetched,
    setThreeMonthScheduleDayAllFetched,
    setTimeOffRequestsFetched,
  };
}
