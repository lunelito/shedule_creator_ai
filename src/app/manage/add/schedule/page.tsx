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
export type employeType = {
  email: string;
  name: string;
  user_id: number;
  role: string;
  position: string;
  employee_code: string;
  organization_id: number;
  default_hourly_rate: number;
  contract_type: string;
  contracted_hours_per_week: number;
  max_consecutive_days: number;
};

export default function AddPageShedule() {
  const router = useRouter();
  // future create employeees on this tab
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
        user_id: userData.id,
        employee_code: "",
        organization_id: organizationId ? Number(organizationId) : 0,
        default_hourly_rate: 0,
        contract_type: "admin",
        role: "admin",
        position: "admin",
        contracted_hours_per_week: 0,
        max_consecutive_days: 0,
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
      setError("dodaj pracowników");
      return;
    }

    const formData = new FormData();
    formData.append("employees", JSON.stringify(userList));
    formData.append("schedule_id", value);

    try {
      const result = await addEmployees({ errors: {} }, formData); // Twoja server action
      console.log(result);
      if (result.success) {
        setError("");
        return true;
      } else {
        const userErrors = result.errors.users?.[0]
          ? result.errors.users[0] + " in employees fields"
          : null;
        const formError =
          result.errors._form?.[0] ?? "Error while inserting employees";

        setError(userErrors ?? formError);
        return false;
      }
    } catch (err) {
      console.error(err);
      setError("error serwera");
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
        return result.schedule_id;
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
        return false;
      }
    } catch (err) {
      console.error(err);
      setError("Błąd serwera");
    }
  };

  const createSheduleWithEmployees = async () => {
    const value = await sendShedule();
    if (value) {
      console.log(value);
      const empResult = await sendEmployees(value);
      console.log(empResult);
      if (empResult) {
        console.log("Grafik i pracownicy dodani");
      }
    }
  };

  const [userRoleList, setUserRoleList] = useState<string[]>([]);
  console.log(userList);

  if (!userData) {
    <p>Loading...</p>;
  }

  return (
    <RenderAnimation animationKey={"AddPage"}>
      <div className="flex w-full h-full flex-col p-10 justify-between md:flex-row scroll-none">
        <div className="h-full w-full flex flex-col">
          {/* title of page */}
          <div className="flex items-center w-fit gap-4  p-4 rounded-lg hover:scale-110 transition-all ease-in-out">
            <button onClick={() => router.back()}>
              <Image
                src={"/Icons/arrowIcon.svg"}
                width={50}
                height={50}
                alt="arrow"
                className="rotate-270 invert"
              />
            </button>
            <h1 className="text-[clamp(1rem,6vw,2rem)] font-bold text-white">
              Add Schedule
            </h1>
          </div>
          <div className="flex gap-5 mt-10">
            {/* ading employesss */}
            <div className="w-full flex flex-col items-center space-y-4">
              <Input
                name="name"
                text="Shedule Name"
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
            </div>
            <div className="w-full flex flex-col items-center space-y-4">
              <UserRoleForm
                userRoleList={userRoleList}
                setUserRoleList={setUserRoleList}
              />
            </div>
          </div>
          <p>{error}</p>
          <button type="submit" onClick={createSheduleWithEmployees}>
            dodaj
          </button>
        </div>
      </div>
    </RenderAnimation>
  );
}
