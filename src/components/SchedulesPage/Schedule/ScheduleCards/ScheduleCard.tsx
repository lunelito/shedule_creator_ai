import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";
import React, { RefObject, SetStateAction, useEffect, useState } from "react";
import ScheduleCardslegend from "./ScheduleCardslegend";
import EmployeesPerDayDotContainer from "./EmployeesPerDayDotContainer";
import SlideFromTop from "@/animations/SlideFromTop";

type ScheduleCard = {
  organizationId: ParamValue;
  id: number;
  name: string;
  setContainerSize: React.Dispatch<SetStateAction<number>>;
  scheduleCardRef: RefObject<HTMLDivElement | null>;
};

export type DayEmployees = {
  name: string;
  employees: number;
};

export default function ScheduleCard({
  organizationId,
  id,
  name,
  setContainerSize,
  scheduleCardRef,
}: ScheduleCard) {
  const [showLegend, setShowLegend] = useState<boolean>(false);
  // z bzazy ile oosb w danym dniu tygdonia
  const employeesPerDay: DayEmployees[] = [
    { name: "Mon", employees: 20 },
    { name: "Tue", employees: 4 },
    { name: "Wed", employees: 4 },
    { name: "Thu", employees: 2 },
    { name: "Fri", employees: 10 },
    { name: "Sat", employees: 20 },
    { name: "Sun", employees: 9 },
  ];

  const colors = new Map<number, string>([
    [0, "bg-teal-100"],
    [1, "bg-teal-200"],
    [2, "bg-teal-300"],
    [3, "bg-teal-500"],
    [4, "bg-teal-700"],
    [5, "bg-teal-900"],
  ]);

  const getColorByEmployeeNum = (num: number) => {
    if (num >= 1 && num < 5) return 2;
    if (num >= 5 && num < 10) return 3;
    if (num >= 10 && num < 15) return 4;
    if (num >= 15 && num < 20) return 5;
    if (num >= 20) return 6;
    return 1;
  };

  const router = useRouter();

  useEffect(() => {
    if (scheduleCardRef.current) {
      setContainerSize(scheduleCardRef.current.offsetHeight);
    }
  }, [scheduleCardRef]);

  return (
    <div className="group" ref={scheduleCardRef}>
      <div className="bg-teal-600 rounded-xl md:rounded-2xl pt-1 transition-transform duration-300 group-hover:-translate-y-2">
        <div
          className="border-1 h-fit flex-col border-t-transparent bg-zinc-800 cursor-pointer border-zinc-600 p-4 gap-4 md:p-6 rounded-xl md:rounded-2xl flex"
          onClick={() =>
            router.push(`/manage/organization/${organizationId}/${id}`)
          }
        >
          <div>
            <div className="flex justify-between">
              <p className="text-lg">{name}</p>
              {/* poole z bazy ktore mowi czy ktos AKTUALNIE pracuje */}
              <div className="flex items-center gap-4">
                <p className="text-sm text-teal-800 bg-teal-200 px-3 py-1 rounded-full inline-flex items-center">
                  Aktywny
                </p>
                <div>
                  <button
                    className="bg-teal-200 text-teal-800 w-7 h-7 rounded-4xl cursor-help"
                    onMouseEnter={() => setShowLegend(true)}
                    onMouseLeave={() => setShowLegend(false)}
                  >
                    ?
                  </button>
                </div>
              </div>
            </div>
            {/* ilość pracowników też z bazy */}
            <p className="text-sm">6 pracowników</p>
          </div>
          <EmployeesPerDayDotContainer
            colors={colors}
            employeesPerDay={employeesPerDay}
            getColorByEmployeeNum={getColorByEmployeeNum}
          />
          {showLegend && (
            <SlideFromTop position={0}>
              <ScheduleCardslegend colors={colors} />
            </SlideFromTop>
          )}
        </div>
      </div>
    </div>
  );
}
