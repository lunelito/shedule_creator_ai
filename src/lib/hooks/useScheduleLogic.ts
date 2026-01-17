import {
  EmployeeShift,
  ShiftFetched,
} from "@/app/manage/add/addSheduleDay/page";
import { schedules_day } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type useScheduleLogicType = {
  selectedDate: Date;
  dataThreeMonthScheduleDayAllFetched: InferSelectModel<
    typeof schedules_day
  >[][];
};

export function useScheduleLogic({
  selectedDate,
  dataThreeMonthScheduleDayAllFetched,
}: useScheduleLogicType) {
  const formatedData = (baseDate: Date) => {
    const date = new Date(baseDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const getWeekRangeMondaySunday = (date: Date) => {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };
  const CheckIfCanWork = (maxDays: number, empId: number): boolean | null => {
    if (maxDays === 0) return false;

    const dataAll = dataThreeMonthScheduleDayAllFetched.flat();

    const today = new Date(selectedDate).toISOString().split("T")[0];

    const minDate = new Date(selectedDate);
    minDate.setDate(minDate.getDate() - maxDays);
    const minDateStr = minDate.toISOString().split("T")[0];

    const maxDate = new Date(selectedDate);
    maxDate.setDate(maxDate.getDate() + maxDays);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    const employeeShifts = dataAll.filter(
      (shift) =>
        shift.date &&
        shift.date >= minDateStr &&
        shift.date <= maxDateStr &&
        shift.assigned_employee_id === empId,
    );

    employeeShifts.sort((a, b) => {
      return new Date(a.date!).getTime() - new Date(b.date!).getTime();
    });

    const shiftDates = employeeShifts.map((shift) => shift.date!);

    const hasShiftToday = shiftDates.includes(today);

    if (hasShiftToday) return null;

    let maxConsecutive = 0;
    let currentConsecutive = 0;

    const allDatesInRange: string[] = [];
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      allDatesInRange.push(d.toISOString().split("T")[0]);
    }

    for (const date of allDatesInRange) {
      if (shiftDates.includes(date)) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 0;
      }
    }

    return maxConsecutive >= maxDays;
  };
  const getRemainingWeeklyHours = (
    empId: number,
    contractedHoursPerWeek: number,
    selectedDate: Date,
  ): number => {
    const dataAll = dataThreeMonthScheduleDayAllFetched
      .flat()
      .filter((el) => el.assigned_employee_id === empId);

    const { monday, sunday } = getWeekRangeMondaySunday(selectedDate);

    const start = formatedData(monday);
    const end = formatedData(sunday);

    const weekOfShifts = dataAll.filter(
      (el) => el.date >= start && el.date <= end,
    );

    const sumHours = weekOfShifts.reduce(
      (acc, curr) => acc + Number(curr.scheduled_hours),
      0,
    );

    return contractedHoursPerWeek - sumHours;
  };
  const parseData = (
    data: InferSelectModel<typeof schedules_day>[],
    employeeShifts: EmployeeShift[],
  ): ShiftFetched[] => {
    return data.map((shift) => {
      const employeeShift = employeeShifts.find(
        (el) => el.employee_id === shift.assigned_employee_id,
      );

      return {
        id: shift.id,
        employee_id: shift.assigned_employee_id ?? 0,
        user_id: shift.created_by ?? 0,
        start_hour: new Date(shift.start_at).getHours(),
        end_hour: new Date(shift.end_at).getHours(),
        selected: false,
        date: shift.date,
        cantWork: false,
        remainingWeeklyHours: employeeShift?.remainingWeeklyHours ?? 40,
      };
    });
  };
  return {
    formatedData,
    getRemainingWeeklyHours,
    CheckIfCanWork,
    parseData,
  };
}
