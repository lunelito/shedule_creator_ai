import Loader from "@/components/UI/Loader";
import StairsContainer from "@/components/UI/StairsContainer";
import { employees, schedules_day } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { AfterContext } from "next/dist/server/after/after-context";
import React, { useEffect, useState } from "react";

type EmployeeCalcSalaryType = {
  dataThreeMonthScheduleDay: InferSelectModel<typeof schedules_day>[][];
  presentMonth: string;
  employeeFetched: InferSelectModel<typeof employees>;
  dataThreeMonthScheduleDayAll: InferSelectModel<typeof schedules_day>[][];
  employeesFetched: InferSelectModel<typeof employees>[];
};

type detailScheduleDays = {
  pastMonth: InferSelectModel<typeof schedules_day>[];
  PresentMonth: {
    before: InferSelectModel<typeof schedules_day>[];
    after: InferSelectModel<typeof schedules_day>[];
  };
  futureMonth: InferSelectModel<typeof schedules_day>[];
};
type detailScheduleDaysAll = {
  pastMonth: InferSelectModel<typeof schedules_day>[];
  PresentMonth: InferSelectModel<typeof schedules_day>[];
  futureMonth: InferSelectModel<typeof schedules_day>[];
};

export default function EmployeeCalcSalary({
  dataThreeMonthScheduleDay,
  presentMonth,
  employeeFetched,
  dataThreeMonthScheduleDayAll,
  employeesFetched,
}: EmployeeCalcSalaryType) {
  const [detailScheduleDays, setDetailScheduleDays] =
    useState<detailScheduleDays>();
  const [detailScheduleDaysAll, setDetailScheduleDaysAll] =
    useState<detailScheduleDaysAll>();

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (dataThreeMonthScheduleDay) {
      const targetDate = new Date(presentMonth);

      const allSchedules = dataThreeMonthScheduleDay[1];

      const before = allSchedules.filter(
        (item) => item.date && new Date(item.date) < targetDate
      );

      const after = allSchedules.filter(
        (item) => item.date && new Date(item.date) > targetDate
      );

      setDetailScheduleDays({
        pastMonth: [...dataThreeMonthScheduleDay[0]],
        PresentMonth: { before: [...before], after: [...after] },
        futureMonth: [...dataThreeMonthScheduleDay[2]],
      });
    }
  }, [dataThreeMonthScheduleDay]);

  useEffect(() => {
    if (dataThreeMonthScheduleDayAll) {
      setDetailScheduleDaysAll({
        pastMonth: [...dataThreeMonthScheduleDayAll[0]],
        PresentMonth: [...dataThreeMonthScheduleDayAll[1]],
        futureMonth: [...dataThreeMonthScheduleDayAll[2]],
      });
    }
  }, [dataThreeMonthScheduleDayAll]);

  const countMoneyEarned = (tab: InferSelectModel<typeof schedules_day>[]) => {
    const suma = tab.reduce((acc, cur) => {
      return acc + Number(cur.scheduled_hours);
    }, 0);
    return suma * Number(employeeFetched.default_hourly_rate);
  };

  const countHoursWorked = (tab: InferSelectModel<typeof schedules_day>[]) => {
    const suma = tab.reduce((acc, cur) => {
      return acc + Number(cur.scheduled_hours);
    }, 0);
    return suma;
  };

  const countDaysWorked = (tab: InferSelectModel<typeof schedules_day>[]) => {
    const dateHoursObj = tab.map((el) => ({
      scheduled_hours: el.scheduled_hours,
      date: el.date,
    }));

    const theDay = dateHoursObj.reduce((min, el) =>
      el.scheduled_hours < min.scheduled_hours ? el : min
    );

    return theDay;
  };

  const getMyWorkBuddyPresent = (
    tab: InferSelectModel<typeof schedules_day>[],
    type: keyof detailScheduleDaysAll
  ) => {
    if (!tab.length || !tab || !type) return null;

    const searchData = detailScheduleDaysAll?.[type];

    if (!searchData) return null;

    const ids: number[] = [];
    const idsSet = new Set<number>();

    for (const day of tab) {
      for (const present of searchData) {
        if (day.date === present.date) {
          if (present.assigned_employee_id) {
            idsSet.add(present.assigned_employee_id);
            ids.push(present.assigned_employee_id);
          }
        }
      }
    }

    const idsIWorkWithDistinct = [...idsSet].map((id) => ({
      id,
      num: ids.reduce((acc, curr) => {
        if (id === curr) return acc + 1;
        return acc;
      }, 0),
    }));

    const maxNum = Math.max(...idsIWorkWithDistinct.map((el) => el.num));

    const topUsers = idsIWorkWithDistinct.filter((el) => el.num === maxNum);

    const topUserNames = topUsers
      .map((u) => employeesFetched.find((e) => e.id === u.id)?.name)
      .filter(Boolean);

    console.log(topUserNames);

    return topUserNames;
  };

  const getMonth = (tab: InferSelectModel<typeof schedules_day>[]) => {
    if (tab[0].date) {
      const date = new Date(tab[0].date);
      return months[date.getMonth()];
    }
  };

  if (!detailScheduleDays) {
    return <Loader />;
  }

  const pastBuddies = getMyWorkBuddyPresent(
    detailScheduleDays.pastMonth,
    "pastMonth"
  );

  const presentBuddies = getMyWorkBuddyPresent(
    [
      ...detailScheduleDays.PresentMonth.after,
      ...detailScheduleDays.PresentMonth.before,
    ],
    "PresentMonth"
  );

  const futureBuddies = getMyWorkBuddyPresent(
    detailScheduleDays.futureMonth,
    "futureMonth"
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Past Month Card */}
      <StairsContainer
        props="h-fit"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br bg-zinc-900 p-6"
      >
        <div className="relative z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-teal-600/10 blur-3xl" />
          <h3 className="mb-8 text-center text-3xl font-bold text-teal-400">
            {getMonth(detailScheduleDays.pastMonth)}
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-zinc-800/50  p-4">
                <p className="mb-2 text-sm text-gray-400">Total Earned</p>
                <p className="text-2xl font-bold text-white">
                  ${countMoneyEarned(detailScheduleDays.pastMonth)}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-4">
                <p className="mb-2 text-sm text-gray-400">Hours Worked</p>
                <p className="text-2xl font-bold text-white">
                  {countHoursWorked(detailScheduleDays.pastMonth)}
                  <span className="text-sm text-gray-400 ml-1">hrs</span>
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-800/50  p-4">
              <p className="mb-3 text-sm font-medium text-gray-300">
                Longest Shift
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {countDaysWorked(detailScheduleDays.pastMonth).date}
                  </p>
                  <p className="text-sm text-gray-400">Date</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-teal-400">
                    {Number(
                      countDaysWorked(detailScheduleDays.pastMonth)
                        .scheduled_hours
                    )}
                  </p>
                  <p className="text-sm text-gray-400">Hours</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-r to-teal-600 from-teal-500/20  p-4">
              <p className="mb-1 text-sm text-gray-300">
                {pastBuddies && pastBuddies.length > 1
                  ? "Work Besties"
                  : "Work Bestie"}
              </p>
              <p className="text-lg font-semibold text-white">
                {pastBuddies?.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </StairsContainer>

      {/* Current Month Card */}
      <StairsContainer className="relative overflow-hidden rounded-2xl bg-gradient-to-b  p-6 shadow-xl">
        <div className="relative z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-teal-600/10 blur-3xl" />
          <h3 className="mb-8 text-center text-3xl font-bold text-teal-600">
            {getMonth(detailScheduleDays.PresentMonth.after)}
          </h3>

          <div className="space-y-8">
            {/* Before Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-teal-300 border-b border-teal-600/30 pb-2">
                Past this month
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-zinc-800/50  p-3">
                  <p className="text-xs text-gray-400">Earned</p>
                  <p className="text-lg font-bold text-white">
                    ${countMoneyEarned(detailScheduleDays.PresentMonth.before)}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800/50  p-3">
                  <p className="text-xs text-gray-400">Hours</p>
                  <p className="text-lg font-bold text-white">
                    {countHoursWorked(detailScheduleDays.PresentMonth.before)}
                  </p>
                </div>
              </div>
            </div>

            {/* After Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-teal-300 border-b border-teal-500/30 pb-2">
                Future this month
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-zinc-800/50  p-3">
                  <p className="text-xs text-gray-400">Earned</p>
                  <p className="text-lg font-bold text-white">
                    ${countMoneyEarned(detailScheduleDays.PresentMonth.after)}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800/50  p-3">
                  <p className="text-xs text-gray-400">Hours</p>
                  <p className="text-lg font-bold text-white">
                    {countHoursWorked(detailScheduleDays.PresentMonth.after)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-teal-300 border-b border-teal-500/30 pb-2">
                This month
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-zinc-800/50  p-3">
                  <p className="text-xs text-gray-400">Earned</p>
                  <p className="text-lg font-bold text-white">
                    $
                    {countMoneyEarned(detailScheduleDays.PresentMonth.after) +
                      countMoneyEarned(detailScheduleDays.PresentMonth.before)}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800/50  p-3">
                  <p className="text-xs text-gray-400">Hours</p>
                  <p className="text-lg font-bold text-white">
                    {countHoursWorked(detailScheduleDays.PresentMonth.after) +
                      countHoursWorked(detailScheduleDays.PresentMonth.before)}
                  </p>
                </div>
              </div>
            </div>

            {/* Longest Shifts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-teal-500/10 p-4">
                <p className="mb-2 text-sm font-medium text-teal-300">
                  Longest Shift in Past in{" "}
                  {getMonth(detailScheduleDays.PresentMonth.after)}
                </p>
                <p className="text-sm text-white">
                  {countDaysWorked(detailScheduleDays.PresentMonth.before).date}
                </p>
                <p className="text-lg font-bold text-teal-300">
                  {Number(
                    countDaysWorked(detailScheduleDays.PresentMonth.before)
                      .scheduled_hours
                  )}
                  h
                </p>
              </div>

              <div className="rounded-lg bg-teal-500/10 p-4">
                <p className="mb-2 text-sm font-medium text-teal-300">
                  Longest Shift in future in{" "}
                  {getMonth(detailScheduleDays.PresentMonth.after)}
                </p>
                <p className="text-sm text-white">
                  {countDaysWorked(detailScheduleDays.PresentMonth.after).date}
                </p>
                <p className="text-lg font-bold text-teal-400">
                  {Number(
                    countDaysWorked(detailScheduleDays.PresentMonth.after)
                      .scheduled_hours
                  )}
                  h
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-gradient-to-r to-teal-600 from-teal-500/20  p-4">
              <p className="mb-1 text-sm text-gray-300">
                {presentBuddies && presentBuddies.length > 1
                  ? "Work Besties"
                  : "Work Bestie"}
              </p>
              <p className="text-lg font-semibold text-white">
                {presentBuddies?.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </StairsContainer>

      {/* Future Month Card */}
      <StairsContainer
        props="h-fit"
        className="relative overflow-hidden rounded-2xl p-6 shadow-xl"
      >
        <div className="relative z-10 h-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-teal-600/10 blur-3xl" />{" "}
          <h3 className="mb-8 text-center text-3xl font-bold text-teal-600">
            {getMonth(detailScheduleDays.futureMonth)}
          </h3>
          <div className="space-y-6 ">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-zinc-800/50  p-4">
                <p className="mb-2 text-sm text-gray-400">Projected Earnings</p>
                <p className="text-2xl font-bold text-white">
                  ${countMoneyEarned(detailScheduleDays.futureMonth)}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-4">
                <p className="mb-2 text-sm text-gray-400">Scheduled Hours</p>
                <p className="text-2xl font-bold text-white">
                  {countHoursWorked(detailScheduleDays.futureMonth)}
                  <span className="text-sm text-gray-400 ml-1">hrs</span>
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-800/50  p-4">
              <p className="mb-3 text-sm font-medium text-gray-300">
                Longest Scheduled Shift
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {countDaysWorked(detailScheduleDays.futureMonth).date}
                  </p>
                  <p className="text-sm text-gray-400">Date</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-teal-600">
                    {Number(
                      countDaysWorked(detailScheduleDays.futureMonth)
                        .scheduled_hours
                    )}
                  </p>
                  <p className="text-sm text-gray-400">Hours</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-r to-teal-600 from-teal-500/20  p-4">
              <p className="mb-1 text-sm text-gray-300">
                {futureBuddies && futureBuddies.length > 1
                  ? "Work Besties"
                  : "Work Bestie"}
              </p>
              <p className="text-lg font-semibold text-white">
                {futureBuddies?.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </StairsContainer>
    </div>
  );
}