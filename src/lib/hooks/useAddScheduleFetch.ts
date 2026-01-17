import { InferSelectModel } from "drizzle-orm";
import { useEffect, useMemo, useState } from "react";
import useFetch from "./useFetch";
import { schedules_day, time_off_requests } from "@/db/schema";

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

type UseAllDataFetchedProps = {
  selectedDate: Date;
  scheduleId: string | number | null;
};

export function useAddScheduleFetch({
  selectedDate,
  scheduleId,
}: UseAllDataFetchedProps) {
  const { pastMonth, presentMonth, futureMonth } = useMemo(() => {
    const pastMonth = formatDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() - 1,
        selectedDate.getDate(),
      ),
    );

    const presentMonth = formatDate(selectedDate);

    const futureMonth = formatDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        selectedDate.getDate(),
      ),
    );

    return { pastMonth, presentMonth, futureMonth };
  }, [selectedDate]);

  const [timeOffRequestsData, setTimeOffRequestsData] = useState<
    InferSelectModel<typeof time_off_requests>[]
  >([]);

  const [
    dataThreeMonthScheduleDayAllFetched,
    setDataThreeMonthScheduleDayAllFetched,
  ] = useState<InferSelectModel<typeof schedules_day>[][]>([]);

  const [shiftsDataFetched, setShiftsDataFetched] = useState<
    InferSelectModel<typeof schedules_day>[]
  >([]);

  const {
    data: shiftsData,
    error: shiftError,
    isPending: isShiftsPending,
  } = useFetch<InferSelectModel<typeof schedules_day>[]>(
    `/api/schedules_day?date=${presentMonth}&schedule_id=${scheduleId}`,
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
    `/api/time-off-request/${scheduleId}`,
  );

  useEffect(() => {
    if (dataTimeOffRequests) {
      setTimeOffRequestsData(dataTimeOffRequests);
    }
  }, [dataTimeOffRequests]);

  useEffect(() => {
    if (shiftsData) {
      setShiftsDataFetched(shiftsData);
    }
  }, [shiftsData]);

  useEffect(() => {
    if (dataThreeMonthScheduleDayAll) {
      setDataThreeMonthScheduleDayAllFetched(dataThreeMonthScheduleDayAll);
    }
  }, [dataThreeMonthScheduleDayAll]);

  const isPending =
    isPendingTimeOffRequests ||
    isPendingThreeMonthScheduleDayAll ||
    isShiftsPending;

  const error =
    errorTimeOffRequests || errorThreeMonthScheduleDayAll || shiftError;

  return {
    shiftsDataFetched,
    dataThreeMonthScheduleDayAllFetched,
    timeOffRequestsFetched: timeOffRequestsData,
    isPending,
    error,
    setDataThreeMonthScheduleDayAllFetched,
    setShiftsDataFetched,
    setTimeOffRequestsData,
  };
}
