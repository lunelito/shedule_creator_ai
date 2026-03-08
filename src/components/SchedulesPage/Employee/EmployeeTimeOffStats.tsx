import StairsContainer from "@/components/UI/StairsContainer";
import React from "react";

type timeOffDisplayType = {
  month: string;
  Vacation: {
    paidLeave: number;
    unpaidLeave: number;
    SickLeave: number;
    parentalLeave: number;
    SpecialLeave: number;
    TrainginLeave: number;
    OtherLeave: number;
  };
  longestVacation: {
    date: Date;
    days: number;
  };
  totalDaysOff: number;
};

type timeOffDisplaysType = timeOffDisplayType[];

export default function EmployeeTimeOffStats() {
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

  const formatedData = (baseDate: Date) => {
    const date = new Date(baseDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const timeOffDisplay: timeOffDisplaysType = [
    {
      month: months[new Date().getMonth() - (1 % 12)],
      Vacation: {
        paidLeave: 10,
        unpaidLeave: 5,
        SickLeave: 5,
        parentalLeave: 5,
        SpecialLeave: 5,
        TrainginLeave: 5,
        OtherLeave: 5,
      },
      longestVacation: {
        date: new Date(),
        days: 6,
      },
      totalDaysOff: 40,
    },
    {
      month: months[new Date().getMonth()],
      Vacation: {
        paidLeave: 10,
        unpaidLeave: 5,
        SickLeave: 5,
        parentalLeave: 5,
        SpecialLeave: 5,
        TrainginLeave: 5,
        OtherLeave: 5,
      },
      longestVacation: {
        date: new Date(),
        days: 6,
      },
      totalDaysOff: 40,
    },
    {
      month: months[new Date().getMonth() + (1 % 12)],
      Vacation: {
        paidLeave: 10,
        unpaidLeave: 5,
        SickLeave: 5,
        parentalLeave: 5,
        SpecialLeave: 5,
        TrainginLeave: 5,
        OtherLeave: 5,
      },
      longestVacation: {
        date: new Date(),
        days: 6,
      },
      totalDaysOff: 40,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {timeOffDisplay.map((el, i) => (
        <StairsContainer
          key={i}
          props="h-fit"
          className="relative overflow-hidden rounded-2xl p-6 shadow-xl"
        >
          <div className="relative z-10 h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-teal-600/10 blur-3xl" />{" "}
            <h3 className="mb-8 text-center text-3xl font-bold text-teal-600">
              {el.month}
            </h3>
            <div className="space-y-6 ">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-zinc-800/50  p-4">
                  <p className="mb-2 text-sm text-gray-400">Vacation Type</p>
                  <div className="flex flex-col gap-3">
                    {Object.entries(el.Vacation).map(([key, val]) => (
                      <p
                        className="text-2xl font-bold text-white"
                        key={`${key}${el.month}`}
                      >
                        {key}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-4">
                  <p className="mb-2 text-sm text-gray-400">Days off:</p>
                  <div className="flex flex-col gap-3">
                    {Object.entries(el.Vacation).map(([key, val]) => (
                      <p
                        className="text-2xl font-bold text-white"
                        key={`${key}${val}${el.month}`}
                      >
                        {val}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-zinc-800/50  p-4">
                <p className="mb-3 text-sm font-medium text-gray-300">
                  The longest vacation in
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {formatedData(el.longestVacation.date)}
                    </p>
                    <p className="text-sm text-gray-400">Start date</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-teal-600">{el.longestVacation.days}</p>
                    <p className="text-sm text-gray-400">Days</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gradient-to-r to-teal-600 from-teal-500/20  p-4">
                <p className="mb-1 text-sm text-gray-300">Total days off:</p>
                <p className="text-lg font-semibold text-white">{el.totalDaysOff}</p>
              </div>
            </div>
          </div>
        </StairsContainer>
      ))}
    </div>
  );
}
