"use client";

import { employees, schedules_day, users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RenderAnimation from "@/animations/RenderAnimation";
import NumberPicker from "@/components/UI/NumberPicker";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { useUserDataContext } from "@/context/userContext";
import { useSearchParams } from "next/navigation";
import { addSingleSheduleDay } from "@/lib/actions/Schedule/addSingleSheduleDay";
import { AnimatePresence } from "framer-motion";
import FadeAnimation from "@/animations/FadeAnimation";
import useFetch from "../../../../../hooks/useFetch";
import Loader from "@/components/UI/Loader";
import { undefined } from "zod";

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

type EmployeeShift = {
  employee_id: number;
  user_id: number;
  start_hour: number;
  end_hour: number;
};

type UsersData = {
  [key: number]: InferSelectModel<typeof users>;
};

export default function AddScheduleDay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const scheduleId = searchParams.get("shedule_id");
  console.log(scheduleId);
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
  const [fetchedShiftsData, setFetchedShiftsData] = useState<EmployeeShift[]>(
    []
  );

  const [editable, setEditable] = useState(false);

  const formatedData = (baseDate: Date) => {
    const date = new Date(baseDate);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const { data: employeeLogInData } =
    useFetch<InferSelectModel<typeof employees>>(`/api/employees/me`);

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
      const newShifts: Shift[] = employeeShifts.map((employeeShift) => {
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

  const handleTimeChange = (
    employeeId: number,
    type: "start" | "end",
    hour: number
  ) => {
    setEmployeeShifts((prev) => {
      const shift = prev.find((s) => s.employee_id === employeeId);
      if (!shift) return prev;

      const start = type === "start" ? hour : shift.start_hour;
      const end = type === "end" ? hour : shift.end_hour;

      const diff = end - start;

      if (hour < 0 || hour > 24 || diff > 12 || diff < 0) {
        return prev;
      }

      return prev.map((s) =>
        s.employee_id === employeeId
          ? {
              ...s,
              [type === "start" ? "start_hour" : "end_hour"]: hour,
            }
          : s
      );
    });
  };

  const fetchData = () => {
    try {
      const storedEmployees = localStorage.getItem("employeesTab");
      if (storedEmployees) {
        const parsedEmployees: InferSelectModel<typeof employees>[] =
          JSON.parse(storedEmployees);
        setEmployeesTab(parsedEmployees);

        const initialShifts: EmployeeShift[] = parsedEmployees.map((emp) => ({
          employee_id: emp.id,
          user_id: emp.user_id,
          start_hour: 8,
          end_hour: 16,
        }));

        setEmployeeShifts(initialShifts);
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  };

  const handleSubmit = async () => {
    const shifts = fillShifts();
    if (shifts) {
      const formData = new FormData();
      formData.append("shifts", JSON.stringify(shifts));
      try {
        const result = await addSingleSheduleDay({ errors: {} }, formData);
        if (result.success && result.schedulesDays?.shifts) {
          const parsed: EmployeeShift[] = result.schedulesDays.shifts.map(
            (shift: InferSelectModel<typeof schedules_day>) => ({
              employee_id: shift.assigned_employee_id,
              user_id: shift.created_by ?? 0,
              start_hour: new Date(shift.start_at).getHours(),
              end_hour: new Date(shift.end_at).getHours(),
            })
          );

          console.log("Parsed shifts:", parsed);

          setFetchedShiftsData(parsed);
          setError("Schedule Added");
          setEditable(false);
        } else {
          setError(
            result.errors._form?.[0] ?? "Error while inserting schedule day"
          );
          return false;
        }
      } catch (e) {
        console.error(e);
        setError("server error");
      }
      console.log("Submitting shifts:", shifts);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (shiftsData) {
      const parsed: EmployeeShift[] = shiftsData.map((shift) => ({
        employee_id: shift.assigned_employee_id!,
        user_id: shift.created_by ?? 0,
        start_hour: new Date(shift.start_at).getHours(),
        end_hour: new Date(shift.end_at).getHours(),
      }));

      setFetchedShiftsData(parsed);
    }
  }, [shiftsData]);

  if (isPending || !shiftsData) {
    return <Loader/>;
  }

  return (
    <RenderAnimation animationKey={"AddPage"}>
      <div className="flex w-full h-full flex-col p-10 scroll-none">
        <div className="flex w-full items-center gap-4 p-4 rounded-lg">
          <button
            onClick={() => router.back()}
            className="hover:scale-150 transition-all ease-in-out cursor-pointer"
          >
            <Image
              src={"/Icons/arrowIcon.svg"}
              width={50}
              height={50}
              alt="arrow"
              className="rotate-270 invert"
            />
          </button>
          <div className="flex justify-between w-full">
            <h1 className="text-[clamp(1rem,6vw,2rem)] font-bold text-white">
              Add Schedule
            </h1>
            <AnimatePresence mode="wait">
              {error && (
                <FadeAnimation
                  animationKey={`errorMessage-${error?.[0] || "unknown"}`}
                >
                  <p className="text-[clamp(1rem,6vw,2rem)] font-bold text-teal-600">
                    {error}!
                  </p>
                </FadeAnimation>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="w-full h-fit grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {employeesTab.length === 0 ? (
            <p className="font-bold text-center p-5 text-teal-600">
              No Employees found
            </p>
          ) : (
            employeesTab.map((emp, i) => {
              const employeeShift = employeeShifts.find(
                (s) => s.employee_id === emp.id
              );

              return (
                <div
                  key={emp.id}
                  className="w-full p-5 border border-teal-600 rounded-lg"
                >
                  <h2 className="text-xl mb-5 m-2 text-center">
                    {emp.name || "Unknown User"}
                    <br />
                    <span className="text-sm text-gray-400">
                      {emp.email || "No email"}
                    </span>
                  </h2>
                  <div className="flex justify-center items-center flex-col">
                    {(fetchedShiftsData[i]?.start_hour == null) && !editable ? (
                      <p className="text-center text-teal-600 text-xl font-bold">
                        deosnt work
                      </p>
                    ) : (
                      <>
                        <div className="mb-4">
                          <p className="text-center mb-2">Shift Start:</p>
                          {editable && !fetchedShiftsData[i] ? (
                            <NumberPicker
                              from={0}
                              to={
                                employeeShift
                                  ? Math.min(
                                      employeeShift.end_hour,
                                      employeeShift.start_hour + 12
                                    )
                                  : 24
                              }
                              orientation="horizontal"
                              title=""
                              rangeDefault={employeeShift?.start_hour || 8}
                              onChange={(value) =>
                                handleTimeChange(emp.id, "start", value)
                              }
                            />
                          ) : (
                            <p className="text-center text-teal-600 text-xl font-bold">
                              {fetchedShiftsData[i]?.start_hour.toString() +
                                ":00"}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-center mb-2">Shift End:</p>
                          {editable && !fetchedShiftsData[i] ? (
                            <NumberPicker
                              from={
                                employeeShift
                                  ? Math.max(0, employeeShift.start_hour)
                                  : 0
                              }
                              to={
                                employeeShift
                                  ? Math.min(24, employeeShift.start_hour + 12)
                                  : 24
                              }
                              orientation="horizontal"
                              title=""
                              rangeDefault={employeeShift?.end_hour || 16}
                              onChange={(value) =>
                                handleTimeChange(emp.id, "end", value)
                              }
                            />
                          ) : (
                            <p className="text-center text-teal-600 text-xl font-bold">
                              {fetchedShiftsData ? fetchedShiftsData[i]?.end_hour.toString() +
                                ":00" : "doesnt work"}
                            </p>
                          )}
                        </div>
                        {employeeShift && (
                          <div className="mt-4 p-2 rounded text-center">
                            <p className="text-sm">
                              Duration:{" "}
                              <span className="font-bold text-teal-400">
                                {employeeShift.end_hour -
                                  employeeShift.start_hour}
                                h
                              </span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {employeeShift.start_hour}:00 -{" "}
                              {employeeShift.end_hour}:00
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {employeeLogInRole === "admin" &&
          editable &&
          (fetchedShiftsData.length > 0 ? (
            <></>
          ) : (
            <div className="mt-8 flex justify-center gap-4">
              <PrimaryButton onClick={handleSubmit}>Add Shifts</PrimaryButton>
            </div>
          ))}

        <div className="mt-6 text-center text-sm ">
          {employeesTab.length > 0 && (
            <p className="text-gray-400">
              Configuring shifts for {employeesTab.length} employee
              {employeesTab.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {employeeLogInRole === "admin" &&
          (fetchedShiftsData.length > 0 ? (
            <></>
          ) : (
            <div className="m-5 text-center">
              <PrimaryButton onClick={() => setEditable((prev) => !prev)}>
                click here if you want to {editable ? "see" : "edit"} schedule
                hours
              </PrimaryButton>
            </div>
          ))}
      </div>
    </RenderAnimation>
  );
}