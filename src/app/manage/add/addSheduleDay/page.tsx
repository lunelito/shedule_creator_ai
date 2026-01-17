"use client";

import {
  employees,
  schedules_day,
  time_off_requests,
  users,
} from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RenderAnimation from "@/animations/RenderAnimation";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { useUserDataContext } from "@/context/userContext";
import { useSearchParams } from "next/navigation";
import { addSingleSheduleDay } from "@/lib/actions/Schedule/addSingleSheduleDay";
import { AnimatePresence } from "framer-motion";
import FadeAnimation from "@/animations/FadeAnimation";
import useFetch from "../../../../lib/hooks/useFetch";
import Loader from "@/components/UI/Loader";
import AddSheduleCard from "@/components/addSheduleDay/AddScheduleCard";
import SheduleCard from "@/components/addSheduleDay/ScheduleCard";
import EditScheduleCard from "@/components/addSheduleDay/EditScheduleCard";
import { editSingleSheduleDay } from "@/lib/actions/Schedule/editSingleSheduleDay";
import DashboardHeader from "@/components/UI/DashboardHeader";
import { boolean, includes } from "zod";
import SecondaryButton from "@/components/UI/SecondaryButton";
import EmployeeShifts from "@/components/SchedulesPage/Employee/EmployeeShifts";
import { useEmployeeDataContext } from "@/context/employeeContext";
import EditVacationCard from "@/components/addSheduleDay/EditVacationCard";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const scheduleId = searchParams.get("schedule_id");
  const organizationId = searchParams.get("organization_id");
  const employeeId = searchParams.get("employeeId");
  const { userData } = useUserDataContext();
  const { role } = useEmployeeDataContext();
  const [error, setError] = useState("");
  // const [cantWork, setCantWork] = useState<boolean>(false);
  const [employeesTab, setEmployeesTab] = useState<
    InferSelectModel<typeof employees>[]
  >([]);
  const [employeeLogInRole, setEmployeeLogInRole] = useState("");
  const [employeeShifts, setEmployeeShifts] = useState<EmployeeShift[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(
    dateParam ? new Date(dateParam) : new Date()
  );
  const [timeOffRequestsData, setTimeOffRequestsData] = useState<
    InferSelectModel<typeof time_off_requests>[]
  >([]);

  const [fetchedShiftsData, setFetchedShiftsData] = useState<ShiftFetched[]>(
    []
  );
  const [
    dataThreeMonthScheduleDayAllFetched,
    setDataThreeMonthScheduleDayAllFetched,
  ] = useState<InferSelectModel<typeof schedules_day>[][]>([]);

  const [editFetchedShiftsData, setEditFetchedShiftsData] = useState<
    ShiftFetched[]
  >([]);

  const [editleShow, setEditleShow] = useState(false);
  const [addShow, setAddShow] = useState(false);

  const formatedData = (baseDate: Date) => {
    const date = new Date(baseDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getWeekRangeMondaySunday = (date: Date) => {
    const day = date.getDay(); // 0 = niedziela
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const presentMonth = formatedData(new Date(selectedDate));

  const pastMonth = formatedData(
    new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - 1,
      selectedDate.getDate()
    )
  );
  const futureMonth = formatedData(
    new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      selectedDate.getDate()
    )
  );

  const [cantWork, setCantWork] = useState<Record<number, boolean | null>>({});

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
        shift.assigned_employee_id === empId
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

  const parseData = (
    data: InferSelectModel<typeof schedules_day>[],
    employeeShifts: EmployeeShift[]
  ): ShiftFetched[] => {
    return data.map((shift) => {
      const employeeShift = employeeShifts.find(
        (el) => el.employee_id === shift.assigned_employee_id
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

  const getRemainingWeeklyHours = (
    empId: number,
    contractedHoursPerWeek: number,
    selectedDate: Date
  ): number => {
    const dataAll = dataThreeMonthScheduleDayAllFetched
      .flat()
      .filter((el) => el.assigned_employee_id === empId);

    const { monday, sunday } = getWeekRangeMondaySunday(selectedDate);

    const start = formatedData(monday);
    const end = formatedData(sunday);

    const weekOfShifts = dataAll.filter(
      (el) => el.date >= start && el.date <= end
    );

    const sumHours = weekOfShifts.reduce(
      (acc, curr) => acc + Number(curr.scheduled_hours),
      0
    );

    return contractedHoursPerWeek - sumHours;
  };

  const {
    data: shiftsData,
    error: shiftError,
    isPending,
  } = useFetch<InferSelectModel<typeof schedules_day>[]>(
    `/api/schedules_day?date=${formatedData(
      selectedDate
    )}&schedule_id=${scheduleId}`
  );

  const {
    data: dataThreeMonthScheduleDayAll,
    isPending: isPendingThreeMonthScheduleDayAll,
    error: errorThreeMonthScheduleDayAll,
  } = useFetch<InferSelectModel<typeof schedules_day>[][]>(
    `/api/schedules_day/${scheduleId}?presentMonth=${presentMonth}&pastMonth=${pastMonth}&futureMonth=${futureMonth}`
  );

  const {
    data: dataTimeOffRequests,
    isPending: isPendingTimeOffRequests,
    error: errorTimeOffRequests,
  } = useFetch<InferSelectModel<typeof time_off_requests>[]>(
    `/api/time-off-request/${scheduleId}`
  );

  useEffect(() => {
    if (role) {
      setEmployeeLogInRole(role);
    }
  }, [role]);

  useEffect(() => {
    if (dataTimeOffRequests) {
      setTimeOffRequestsData(dataTimeOffRequests);
    }
  }, [dataTimeOffRequests]);

  useEffect(() => {
    if (dataThreeMonthScheduleDayAll) {
      setDataThreeMonthScheduleDayAllFetched(dataThreeMonthScheduleDayAll);
    }
  }, [dataThreeMonthScheduleDayAll]);

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

      setShifts(newShifts);
      return newShifts;
    }
  };

  const getDataFromLocalHost = () => {
    try {
      const storedEmployees = localStorage.getItem("employeesTab");
      if (storedEmployees) {
        const parsedEmployees: InferSelectModel<typeof employees>[] =
          JSON.parse(storedEmployees);

        // Obliczamy cantWork dla każdego pracownika
        const cantWorkMap: Record<number, boolean | null> = {};
        const initialShifts: EmployeeShift[] = parsedEmployees.map((emp) => {
          const cantWorkResult = CheckIfCanWork(
            emp.max_consecutive_days,
            emp.id as number
          );

          const howManyHoursLeft = getRemainingWeeklyHours(
            emp.id as number,
            Number(emp.contracted_hours_per_week),
            selectedDate
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
              (el) => Number(el.employee_id) === Number(employeeId)
            )
          );
          setEmployeesTab(
            parsedEmployees.filter((el) => Number(el.id) === Number(employeeId))
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
      fetchedShiftsData.map((s) => s.employee_id)
    );

    const newShifts = shifts?.filter(
      (s) => !existingEmployeeIds.has(s.assigned_employee_id!)
    );

    if (newShifts) {
      const formData = new FormData();
      formData.append("shifts", JSON.stringify(newShifts));
      try {
        const result = await addSingleSheduleDay({ errors: {} }, formData);
        if (result.success && result.schedulesDays?.shifts) {
          const parsed: ShiftFetched[] = parseData(
            result.schedulesDays.shifts,
            employeeShifts
          );

          setFetchedShiftsData((prev) => [...prev, ...parsed]);
          setEditFetchedShiftsData((prev) => [...prev, ...parsed]);

          setError("Shifts Added");
          setAddShow(false);
        } else {
          setError(
            result.errors._form?.[0] ?? "Error while inserting schedule day"
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
            employeeShifts
          );
          setFetchedShiftsData(parsed);
          setEditFetchedShiftsData(parsed);
          setError("Shifts Updated");
          setEditleShow(false);
        } else {
          setError(
            result.errors._form?.[0] ?? "Error while changing schedule day"
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
    if (shiftsData) {
      const parsed: ShiftFetched[] = parseData(shiftsData, employeeShifts);
      if (employeeId !== undefined && employeeId !== null) {
        const data = parsed.filter(
          (el) => Number(el.employee_id) === Number(employeeId)
        );
        setFetchedShiftsData(data);
        setEditFetchedShiftsData(data);
      } else {
        setFetchedShiftsData(parsed);
        setEditFetchedShiftsData(parsed);
      }
    }
  }, [shiftsData]);

  if (
    isPending ||
    isPendingTimeOffRequests ||
    !shiftsData ||
    !dataThreeMonthScheduleDayAll ||
    isPendingThreeMonthScheduleDayAll ||
    !dataTimeOffRequests
  ) {
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
        <div className="p-10 w-full h-fit grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {employeesTab.length === 0 ? (
            <p className="font-bold text-center p-5 text-teal-600">
              No Employees found
            </p>
          ) : (
            employeesTab.map((emp, i) => {
              const employeeShift = employeeShifts.find(
                (s) => s.employee_id === emp.id
              );

              const fetchedShift = fetchedShiftsData.find(
                (s) => s.employee_id === emp.id
              );

              const editShift = editFetchedShiftsData?.find(
                (s) => s.employee_id === emp.id
              );

              const timeOff = timeOffRequestsData?.find(
                (s) => s.employee_id === emp.id && s.status === "accepted"
              );
              console.log(timeOff);

              const employeeCantWork = cantWork[emp.id as number] || false;

              if (editleShow && fetchedShift && editShift && !timeOff) {
                return (
                  <EditScheduleCard
                    selectedDate={selectedDate}
                    key={emp.id}
                    getRemainingWeeklyHours={getRemainingWeeklyHours}
                    employeesTab={employeesTab}
                    employeeShifts={employeeShifts}
                    setEmployeeShifts={setEmployeeShifts}
                    CheckIfCanWork={CheckIfCanWork}
                    setCantWork={setCantWork}
                    addShow={addShow}
                    emp={emp}
                    editShift={editShift}
                    fetchedShift={fetchedShift}
                    i={i}
                    setEditleShow={setEditleShow}
                    setError={setError}
                    editFetchedShiftsData={editFetchedShiftsData}
                    setFetchedShiftsData={setFetchedShiftsData}
                    setEditFetchedShiftsData={setEditFetchedShiftsData}
                    setDataThreeMonthScheduleDayAllFetched={
                      setDataThreeMonthScheduleDayAllFetched
                    }
                  />
                );
              }

              if (timeOff && !addShow) {
                return (
                  <EditVacationCard
                    scheduleId={scheduleId}
                    setError={setError}
                    setEditleShow={setEditleShow}
                    timeOff={timeOff}
                    cantWork={employeeCantWork}
                    key={emp.id}
                    addShow={addShow}
                    editleShow={editleShow}
                    emp={emp}
                    setTimeOffRequestsData={setTimeOffRequestsData}
                    fetchedShift={fetchedShift}
                  />
                );
              }

              if (
                employeeShift &&
                addShow &&
                !fetchedShift &&
                !employeeCantWork &&
                !timeOff
              ) {
                return (
                  <AddSheduleCard
                    key={emp.id}
                    emp={emp}
                    dataThreeMonthScheduleDayAllFetched={
                      dataThreeMonthScheduleDayAllFetched
                    }
                    setDataThreeMonthScheduleDayAllFetched={
                      setDataThreeMonthScheduleDayAllFetched
                    }
                    fetchedShiftsData={fetchedShiftsData}
                    employeeShifts={employeeShifts}
                    employeeShift={employeeShift}
                    selectedDate={selectedDate}
                    setEmployeeShifts={setEmployeeShifts}
                  />
                );
              }

              if (!addShow) {
                return (
                  <SheduleCard
                    timeOff={timeOff}
                    cantWork={employeeCantWork}
                    key={emp.id}
                    addShow={addShow}
                    emp={emp}
                    fetchedShift={fetchedShift}
                  />
                );
              }
            })
          )}
        </div>

        {employeeLogInRole === "admin" && (
          <>
            {editleShow && (
              <div className="mt-8 flex justify-center gap-4">
                <PrimaryButton onClick={handleEdit}>Edit Shifts</PrimaryButton>
              </div>
            )}
            {addShow && (!employeeId || !cantWork[Number(employeeId)]) && (
              <div className="mt-8 flex justify-center gap-4">
                <PrimaryButton onClick={handleSubmit}>Add Shifts</PrimaryButton>
              </div>
            )}
          </>
        )}

        <div className="mt-6 text-center text-sm ">
          {employeesTab.length > 0 && !cantWork && (
            <p className="text-gray-400">
              Configuring shifts for {employeesTab.length} employee
              {employeesTab.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {employeeLogInRole === "admin" && (
          <div className="flex justify-center gap-5 m-5">
            {!employeeId && (
              <>
                {!addShow && (
                  <SecondaryButton
                    onClick={() => {
                      setEditleShow((prev) => !prev);
                      setError("");
                    }}
                  >
                    {editleShow ? "see" : "edit"} schedule hours
                  </SecondaryButton>
                )}
                {!(
                  !editleShow &&
                  employeeShifts.length ===
                    fetchedShiftsData.length +
                      employeeShifts.filter(
                        (el) => el.cantWork !== null && el.cantWork !== false
                      ).length
                ) && (
                  <SecondaryButton
                    onClick={() => {
                      setAddShow((prev) => !prev);
                      setError("");
                    }}
                  >
                    {addShow ? "see" : "add"} schedule hours
                  </SecondaryButton>
                )}
              </>
            )}

            {employeeId && (
              <div className="m-5">
                {employeesTab.map((emp) => {
                  const fetchedShift = fetchedShiftsData.find(
                    (s) => s.employee_id === emp.id
                  );
                  if (fetchedShift) {
                    return (
                      <SecondaryButton
                        key={"btn"}
                        onClick={() => {
                          setEditleShow((prev) => !prev);
                          setError("");
                        }}
                      >
                        {editleShow ? "see" : "edit"} schedule hours
                      </SecondaryButton>
                    );
                  } else if (!cantWork[Number(employeeId)]) {
                    return (
                      <SecondaryButton
                        key={"btn"}
                        onClick={() => {
                          setAddShow((prev) => !prev);
                          setError("");
                        }}
                      >
                        {addShow ? "see" : "add"} schedule hours
                      </SecondaryButton>
                    );
                  }
                })}
              </div>
            )}
          </div>
        )}
      </RenderAnimation>
    </div>
  );
}
