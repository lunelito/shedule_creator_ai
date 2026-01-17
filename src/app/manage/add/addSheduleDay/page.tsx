"use client";

import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RenderAnimation from "@/animations/RenderAnimation";
import { useUserDataContext } from "@/context/userContext";
import { addSingleSheduleDay } from "@/lib/actions/ScheduleDay/addSingleSheduleDay";
import Loader from "@/components/UI/Loader";
import { editSingleSheduleDay } from "@/lib/actions/ScheduleDay/editSingleSheduleDay";
import DashboardHeader from "@/components/UI/DashboardHeader";
import { useScheduleLogic } from "@/lib/hooks/useScheduleLogic";
import EmployeeScheduleList from "@/components/addSheduleDay/EmployeeScheduleList";
import ScheduleActions from "@/components/addSheduleDay/ScheduleActions";
import { useAddScheduleFetch } from "@/lib/hooks/useAddScheduleFetch";

type Shift = {
  status: "published" | "draft" | "cancelled" | "completed";
  created_by: number | null;
  template_id: number | null;
  assigned_employee_id: number | null;
  start_at: Date;
  end_at: Date;
  date: string;
  scheduled_hours: string;
  is_published: boolean | null;
  published_by: number | null;
};

export type EmployeeShift = {
  employee_id: number;
  user_id: number;
  start_hour: number;
  end_hour: number;
  selected: boolean;
  cantWork: boolean | null;
  remainingWeeklyHours: number;
};

export type ShiftFetched = EmployeeShift & {
  id: number;
  date: string | null;
  remainingWeeklyHours: number;
};

export default function AddScheduleDay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dateParam = searchParams.get("date");
  const scheduleId = searchParams.get("schedule_id");
  const organizationId = searchParams.get("organization_id");
  const employeeId = searchParams.get("employeeId");
  
  const selectedDate = dateParam ? new Date(dateParam) : new Date();
  const [error, setError] = useState("");
  const [employeesTab, setEmployeesTab] = useState<
    InferSelectModel<typeof employees>[]
  >([]);
  const [employeeShifts, setEmployeeShifts] = useState<EmployeeShift[]>([]);
  const [shiftsDataFetchedParsed, setShiftsDataFetchedParsed] = useState<
    ShiftFetched[]
  >([]);
  const [editFetchedShiftsData, setEditFetchedShiftsData] = useState<
    ShiftFetched[]
  >([]);
  const [editleShow, setEditleShow] = useState(false);
  const [addShow, setAddShow] = useState(false);
  const [cantWork, setCantWork] = useState<Record<number, boolean | null>>({});

  const { userData } = useUserDataContext();

  const {
    shiftsDataFetched,
    dataThreeMonthScheduleDayAllFetched,
    isPending: isPendingFetch,
  } = useAddScheduleFetch({ selectedDate, scheduleId });

  const { formatedData, getRemainingWeeklyHours, CheckIfCanWork, parseData } =
    useScheduleLogic({ selectedDate, dataThreeMonthScheduleDayAllFetched });

  const fillShifts = () => {
    const currentUserId = userData?.id;
    const baseDate = new Date(selectedDate);
    baseDate.setHours(0, 0, 0, 0);
    if (currentUserId && scheduleId) {
      const newShifts: Shift[] = employeeShifts
        .filter((employeeShift) => !employeeShift.selected)
        .filter((employeeShift) => !employeeShift.cantWork)
        .map((employeeShift) => {
          const startDate = new Date(baseDate);
          startDate.setHours(employeeShift.start_hour, 0, 0, 0);

          const endDate = new Date(baseDate);
          endDate.setHours(employeeShift.end_hour, 0, 0, 0);

          const hoursDiff = employeeShift.end_hour - employeeShift.start_hour;
          const scheduledHours = hoursDiff > 0 ? `${hoursDiff}h` : "0h";
          return {
            status: "draft",
            created_by: currentUserId,
            template_id: parseInt(scheduleId),
            assigned_employee_id: employeeShift.employee_id,
            start_at: startDate,
            end_at: endDate,
            date: formatedData(selectedDate),
            scheduled_hours: scheduledHours,
            is_published: false,
            published_by: null,
          };
        });

      return newShifts;
    }
  };

  const getDataFromLocalHost = () => {
    try {
      const storedEmployees = localStorage.getItem("employeesTab");
      if (storedEmployees) {
        const parsedEmployees: InferSelectModel<typeof employees>[] =
          JSON.parse(storedEmployees);

        const cantWorkMap: Record<number, boolean | null> = {};
        const initialShifts: EmployeeShift[] = parsedEmployees.map((emp) => {
          const cantWorkResult = CheckIfCanWork(
            emp.max_consecutive_days,
            emp.id as number,
          );

          const howManyHoursLeft = getRemainingWeeklyHours(
            emp.id as number,
            Number(emp.contracted_hours_per_week),
            selectedDate,
          );

          cantWorkMap[emp.id as number] = cantWorkResult;

          return {
            employee_id: emp.id as number,
            user_id: emp.user_id,
            start_hour: 8,
            selected: false,
            end_hour: 8,
            cantWork: cantWorkResult,
            remainingWeeklyHours: howManyHoursLeft,
          };
        });

        setCantWork(cantWorkMap);

        if (employeeId) {
          setEmployeeShifts(
            initialShifts.filter(
              (el) => Number(el.employee_id) === Number(employeeId),
            ),
          );
          setEmployeesTab(
            parsedEmployees.filter(
              (el) => Number(el.id) === Number(employeeId),
            ),
          );
        } else {
          setEmployeesTab(parsedEmployees);
          setEmployeeShifts(initialShifts);
        }
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  };

  const handleSubmit = async () => {
    const shifts = fillShifts();
    const existingEmployeeIds = new Set(
      shiftsDataFetchedParsed.map((s) => s.employee_id),
    );

    const newShifts = shifts?.filter(
      (s) => !existingEmployeeIds.has(s.assigned_employee_id!),
    );

    if (newShifts) {
      const formData = new FormData();
      formData.append("shifts", JSON.stringify(newShifts));
      try {
        const result = await addSingleSheduleDay({ errors: {} }, formData);
        if (result.success && result.schedulesDays?.shifts) {
          const parsed: ShiftFetched[] = parseData(
            result.schedulesDays.shifts,
            employeeShifts,
          );

          setShiftsDataFetchedParsed((prev) => [...prev, ...parsed]);
          setEditFetchedShiftsData((prev) => [...prev, ...parsed]);

          setError("Shifts Added");
          setAddShow(false);
        } else {
          setError(
            result.errors._form?.[0] ?? "Error while inserting schedule day",
          );
          return false;
        }
      } catch (e) {
        setError("server error");
      }
    }
  };

  const handleEdit = async () => {
    if (editFetchedShiftsData) {
      const baseDate = new Date(selectedDate);
      baseDate.setHours(0, 0, 0, 0);

      const data = editFetchedShiftsData.map((el) => {
        const startDate = new Date(baseDate);
        startDate.setHours(el.start_hour, 0, 0, 0);

        const endDate = new Date(baseDate);
        endDate.setHours(el.end_hour, 0, 0, 0);

        return {
          ...el,
          start_at: startDate,
          end_at: endDate,
        };
      });

      const formData = new FormData();
      formData.append("shifts", JSON.stringify(data));
      try {
        const result = await editSingleSheduleDay({ errors: {} }, formData);
        if (result.success && result.schedulesDays?.shifts) {
          const parsed: ShiftFetched[] = parseData(
            result.schedulesDays.shifts,
            employeeShifts,
          );
          setShiftsDataFetchedParsed(parsed);
          setEditFetchedShiftsData(parsed);
          setError("Shifts Updated");
          setEditleShow(false);
        } else {
          setError(
            result.errors._form?.[0] ?? "Error while changing schedule day",
          );
          return false;
        }
      } catch (e) {
        setError("server error");
      }
    }
  };

  useEffect(() => {
    if (dataThreeMonthScheduleDayAllFetched.length !== 0) {
      getDataFromLocalHost();
    }
  }, [dataThreeMonthScheduleDayAllFetched]);

  useEffect(() => {
    if (shiftsDataFetched) {
      const parsed: ShiftFetched[] = parseData(
        shiftsDataFetched,
        employeeShifts,
      );
      if (employeeId !== undefined && employeeId !== null) {
        const data = parsed.filter(
          (el) => Number(el.employee_id) === Number(employeeId),
        );
        setShiftsDataFetchedParsed(data);
        setEditFetchedShiftsData(data);
      } else {
        setShiftsDataFetchedParsed(parsed);
        setEditFetchedShiftsData(parsed);
      }
    }
  }, [shiftsDataFetched]);

  if (isPendingFetch) {
    return <Loader />;
  }

  return (
    <div className="flex w-full h-full flex-col scroll-none">
      <DashboardHeader
        onClick={() =>
          router.replace(`/manage/organization/${organizationId}/${scheduleId}`)
        }
        title="Add Schedule"
        error={error}
      />
      <RenderAnimation animationKey={"AddPage"}>
        <EmployeeScheduleList
          employeesTab={employeesTab}
          employeeShifts={employeeShifts}
          fetchedShiftsData={shiftsDataFetchedParsed}
          editFetchedShiftsData={editFetchedShiftsData}
          cantWork={cantWork}
          editleShow={editleShow}
          selectedDate={selectedDate}
          setEmployeeShifts={setEmployeeShifts}
          setCantWork={setCantWork}
          addShow={addShow}
          setError={setError}
          setEditleShow={setEditleShow}
          setFetchedShiftsData={setShiftsDataFetchedParsed}
          setEditFetchedShiftsData={setEditFetchedShiftsData}
          scheduleId={scheduleId}
        />

        <ScheduleActions
          editleShow={editleShow}
          addShow={addShow}
          employeeId={employeeId}
          handleEdit={handleEdit}
          handleSubmit={handleSubmit}
          cantWork={cantWork}
          employeesTab={employeesTab}
          employeeShifts={employeeShifts}
          shiftsDataFetchedParsed={shiftsDataFetchedParsed}
          setEditleShow={setEditleShow}
          setAddShow={setAddShow}
          setError={setError}
        />
      </RenderAnimation>
    </div>
  );
}
