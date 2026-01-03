"use client";

import { employees, schedules_day, users } from "@/db/schema";
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
import useFetch from "../../../../../hooks/useFetch";
import Loader from "@/components/UI/Loader";
import AddSheduleCard from "@/components/addSheduleDay/AddScheduleCard";
import SheduleCard from "@/components/addSheduleDay/ScheduleCard";
import EditScheduleCard from "@/components/addSheduleDay/EditScheduleCard";
import { editSingleSheduleDay } from "@/lib/actions/Schedule/editSingleSheduleDay";
import DashboardHeader from "@/components/UI/DashboardHeader";
import { includes } from "zod";
import SecondaryButton from "@/components/UI/SecondaryButton";

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
};

export type ShiftFetched = EmployeeShift & {
  id: number;
};

export default function AddScheduleDay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const scheduleId = searchParams.get("schedule_id");
  const organizationId = searchParams.get("organization_id");
  const employeeId = searchParams.get("employeeId");
  const { userData } = useUserDataContext();
  const [error, setError] = useState("");
  const [employeesTab, setEmployeesTab] = useState<
    InferSelectModel<typeof employees>[]
  >([]);
  const [employeeLogInRole, setEmployeeLogInRole] = useState("");
  const [employeeShifts, setEmployeeShifts] = useState<EmployeeShift[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(
    dateParam ? new Date(dateParam) : new Date()
  );
  const [fetchedShiftsData, setFetchedShiftsData] = useState<ShiftFetched[]>(
    []
  );
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

  const parseData = (
    data: InferSelectModel<typeof schedules_day>[]
  ): ShiftFetched[] => {
    return data.map((shift) => ({
      id: shift.id,
      employee_id: shift.assigned_employee_id ?? 0,
      user_id: shift.created_by ?? 0,
      start_hour: new Date(shift.start_at).getHours(),
      end_hour: new Date(shift.end_at).getHours(),
      selected: false,
    }));
  };

  const { data: employeeLogInData } =
    useFetch<InferSelectModel<typeof employees>>(`/api/employees/me/${scheduleId}`);

  const {
    data: shiftsData,
    error: shiftError,
    isPending,
  } = useFetch<InferSelectModel<typeof schedules_day>[]>(
    `/api/schedules_day?date=${formatedData(
      selectedDate
    )}&schedule_id=${scheduleId}`
  );

  useEffect(() => {
    if (employeeLogInData) {
      setEmployeeLogInRole(employeeLogInData.role);
    }
  }, [employeeLogInData]);

  const fillShifts = () => {
    const currentUserId = userData?.id;
    const baseDate = new Date(selectedDate);
    baseDate.setHours(0, 0, 0, 0);
    if (currentUserId && scheduleId) {
      const newShifts: Shift[] = employeeShifts
        .filter((employeeShift) => !employeeShift.selected)
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

      // const shiftWithoutFetched = newShifts.filter((el,i) => el.includes(fetchedShiftsData.id))

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

        const initialShifts: EmployeeShift[] = parsedEmployees.map((emp) => ({
          employee_id: emp.id as number,
          user_id: emp.user_id,
          start_hour: 8,
          selected: false,
          end_hour: 16,
        }));

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
          const parsed: ShiftFetched[] = parseData(result.schedulesDays.shifts);

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
          const parsed: ShiftFetched[] = parseData(result.schedulesDays.shifts);
          console.log(parsed);
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
    getDataFromLocalHost();
  }, []);

  useEffect(() => {
    if (shiftsData) {
      const parsed: ShiftFetched[] = parseData(shiftsData);
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

  console.log(fetchedShiftsData);
  console.log(editFetchedShiftsData);

  if (isPending || !shiftsData) {
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

              if (editleShow) {
                return (
                  <EditScheduleCard
                    key={emp.id}
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
                  />
                );
              }

              if (employeeShift && addShow && !fetchedShift) {
                return (
                  <AddSheduleCard
                    key={emp.id}
                    emp={emp}
                    fetchedShiftsData={fetchedShiftsData}
                    employeeShifts={employeeShifts}
                    employeeShift={employeeShift}
                    setEmployeeShifts={setEmployeeShifts}
                  />
                );
              }

              if (!addShow) {
                return (
                  <SheduleCard
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

            {addShow && (
              <div className="mt-8 flex justify-center gap-4">
                <PrimaryButton onClick={handleSubmit}>Add Shifts</PrimaryButton>
              </div>
            )}
          </>
        )}

        <div className="mt-6 text-center text-sm ">
          {employeesTab.length > 0 && (
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

                {!editleShow && (
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
                  } else {
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
