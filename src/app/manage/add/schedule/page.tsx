"use client";
import RenderAnimation from "@/animations/RenderAnimation";
import UserSearchList from "@/components/addPage/UserSearchForm";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import UserRoleForm from "@/components/addPage/UserPostionForm";
import { useUserDataContext } from "@/context/userContext";
import Input from "@/components/UI/Input";
import PrimaryButton from "@/components/UI/PrimaryButton";
import Loader from "@/components/UI/Loader";
import DashboardHeader from "@/components/UI/DashboardHeader";
import { addScheduleWithEmployees } from "@/lib/actions/Organization/addScheduleWithEmployees";
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

  const handleCreate = async () => {
    if (shedule.name.length === 0) {
      setError("Add schedule name");
      return;
    }
    if (userList.length === 0) {
      setError("Add employees");
      return;
    }

    const formData = new FormData();
    formData.append("employees", JSON.stringify(userList)); // ← nie "users"
    formData.append("name", shedule.name);
    formData.append("organization_id", organizationId ?? "0");
    formData.append("created_by", userData?.id?.toString() ?? "");

    const result = await addScheduleWithEmployees({ errors: {} }, formData);

    if (result.success) {
      router.back();
    } else {
      setError(
        result.errors.name?.[0] ??
          result.errors.users?.[0] ??
          result.errors._form?.[0] ??
          "Error",
      );
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

            <PrimaryButton onClick={handleCreate}>dodaj</PrimaryButton>
          </div>
        </div>
      </RenderAnimation>
    </div>
  );
}
