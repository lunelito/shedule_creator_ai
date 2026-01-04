"use client";
import RenderAnimation from "@/animations/RenderAnimation";
import UserSearchList from "@/components/addPage/UserSearchForm";
import { InferSelectModel } from "drizzle-orm";
import { users } from "@/db/schema";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import UserRoleForm from "@/components/addPage/UserPostionForm";
import { useUserDataContext } from "@/context/userContext";
import { addEmployees } from "@/lib/actions/Schedule/addEmployees";
import Input from "@/components/UI/Input";
import { addSchedule } from "@/lib/actions/action";
import PrimaryButton from "@/components/UI/PrimaryButton";
import FadeAnimation from "@/animations/FadeAnimation";
import { AnimatePresence } from "framer-motion";
import { deleteEmployee } from "@/lib/actions/Schedule/deleteEmployee";
import { deleteSchedule } from "@/lib/actions/Schedule/deleteShedule";
import Loader from "@/components/UI/Loader";
import DashboardHeader from "@/components/UI/DashboardHeader";
export type employeType = {
  email: string;
  name: string;
  user_id: number;
  image: string;
  role: string;
  position: string;
  employee_code: string;
  organization_id: number;
  default_hourly_rate: number;
  contract_type: string;
  contracted_hours_per_week: number;
  max_consecutive_days: number;
  accept_to_schedule: "waiting" | "accepted" | "declined";
};

export default function AddPageShedule() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const organizationId = searchParams.get("organizationId");
  const [adminUser, setAdminUser] = useState<employeType | null>(null);
  const [userList, setUserList] = useState<employeType[]>([]);
  const { userData } = useUserDataContext();
  const [error, setError] = useState("");

  const [shedule, setShedule] = useState({
    name: "",
    organization_id: organizationId,
    created_by: userData?.id ?? null,
  });

  useEffect(() => {
    if (userData?.id) {
      const newAdminUser: employeType = {
        email: userData.email ?? "admin@example.com",
        name: userData.name ?? "Admin",
        image: userData.image || "/images/pfp-placeholder.png",
        user_id: userData.id,
        employee_code: "",
        organization_id: organizationId ? Number(organizationId) : 0,
        default_hourly_rate: 0,
        contract_type: "full_time",
        role: "admin",
        position: "admin",
        contracted_hours_per_week: 0,
        max_consecutive_days: 0,
        accept_to_schedule: "accepted",
      };
      setAdminUser(newAdminUser);
    }
  }, [userData, organizationId]);

  useEffect(() => {
    if (adminUser) {
      setUserList([adminUser]);
    }
  }, [adminUser]);

  const sendEmployees = async (value: string) => {
    if (userList.length === 0) {
      setError("Add employees");
      return;
    }

    const data = userList.map((el, i) => {
      if (el.accept_to_schedule == "accepted") {
        return el;
      } else {
        return { ...el, accept_to_schedule: "waiting" };
      }
    });

    const formData = new FormData();
    formData.append("employees", JSON.stringify(data));
    formData.append("schedule_id", value);

    try {
      const result = await addEmployees({ errors: {} }, formData);
      if (result.success) {
        setError("Employees added");
        return { result: result };
      } else {
        const userErrors = result.errors.users?.[0]
          ? result.errors.users[0] + " in employees fields"
          : null;
        const formError =
          result.errors._form?.[0] ?? "Error while inserting employees";

        setError(userErrors ?? formError);
        return { result: result };
      }
    } catch (err) {
      console.error(err);
      setError("server error");
    }
  };

  const sendShedule = async () => {
    if (shedule.name.length === 0) {
      setError("Add schedule name");
      return;
    }

    const formData = new FormData();
    formData.append("name", shedule.name);
    formData.append(
      "organization_id",
      shedule.organization_id?.toString() ?? "0"
    );
    formData.append("created_by", shedule.created_by?.toString() ?? "");

    try {
      const result = await addSchedule({ errors: {} }, formData);

      if (result.success) {
        setError("Schedule Added");
        return { result: result };
      } else {
        const userErrors =
          result.errors.name?.[0] ||
          result.errors.created_by?.[0] ||
          result.errors.organization_id?.[0] ||
          null;

        const errorMsg = userErrors
          ? userErrors + " in schedule fields"
          : result.errors._form?.[0] ?? "Error while inserting schedule";

        setError(errorMsg);
        return { result: result };
      }
    } catch (err) {
      console.error(err);
      setError("server error");
    }
  };

  const createSheduleWithEmployees = async () => {
    try {
      const result = await sendShedule();
      if (!result?.result.schedule_id) return;

      const empResult = await sendEmployees(result.result.schedule_id);

      if (empResult?.result.success) {
        router.back();
        return;
      }

      // if (
      //   empResult?.result.errors._form?.[0]?.startsWith(
      //     "Failed to add employee"
      //   )
      // ) {
      //   for (const user of userList.slice(0, userList.length - 1)) {
      //     try {
      //       await deleteEmployee(user.user_id, result.result.schedule_id);
      //     } catch (err) {
      //       console.error(
      //         "Nie udało się usunąć pracownika:",
      //         user.user_id,
      //         err
      //       );
      //     }
      //   }
      // }

      try {
        await deleteSchedule(result.result.schedule_id);
      } catch (err) {
        console.error(
          "Nie udało się usunąć grafiku:",
          result.result.schedule_id,
          err
        );
      }
    } catch (err) {
      console.error("Błąd w createSheduleWithEmployees:", err);
      setError("Nieoczekiwany błąd serwera");
    }
  };

  const [userRoleList, setUserRoleList] = useState<string[]>([]);

  if (!userData) {
    <Loader />;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <DashboardHeader
        onClick={() => router.back()}
        title="Add Schedule"
        error={error}
      />
      <RenderAnimation animationKey={"AddPage"}>
        <div className="flex-1 min-h-full flex justify-center">
          <div className="w-[50vw] max-w-2xl flex flex-col gap-20 py-10">
            <Input
              name="name"
              text="Schedule Name"
              type="text"
              value={shedule.name}
              onChange={(val) => setShedule({ ...shedule, name: val })}
            />

            <UserSearchList
              userList={userList}
              setUserList={setUserList}
              organizationId={organizationId}
              userRoleList={userRoleList}
            />

            <UserRoleForm
              userRoleList={userRoleList}
              setUserRoleList={setUserRoleList}
            />

            <PrimaryButton onClick={createSheduleWithEmployees}>
              dodaj
            </PrimaryButton>
          </div>
        </div>
      </RenderAnimation>
    </div>
  );
}
