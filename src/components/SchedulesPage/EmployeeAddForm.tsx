import React, { SetStateAction, useState } from "react";
import UserSearchList from "../addPage/UserSearchForm";
import { employeType } from "@/app/manage/add/schedule/page";
import { useSearchParams } from "next/navigation";
import UserPositionForm from "../addPage/UserPostionForm";
import { addEmployees } from "@/lib/actions/Schedule/addEmployees";
import { ParamValue } from "next/dist/server/request/params";
import PrimaryButton from "../UI/PrimaryButton";
import { InferSelectModel } from "drizzle-orm";
import { employees, users } from "@/db/schema";

type EmployeeAddFormType = {
  scheduleId: ParamValue;
  setError: React.Dispatch<SetStateAction<string>>;
  setEmployeesTabFilter: React.Dispatch<
    React.SetStateAction<InferSelectModel<typeof employees>[]>
  >;
};

export default function EmployeeAddForm({
  scheduleId,
  setError,
  setEmployeesTabFilter,
}: EmployeeAddFormType) {
  const [userList, setUserList] = useState<employeType[]>([]);
  const searchParams = useSearchParams();
  const [userRoleList, setUserRoleList] = useState<string[]>([]);
  const organizationId = searchParams.get("organizationId");

  const sendEmployees = async (value: string) => {
    if (userList.length === 0) {
      setError("Add employees");
      return;
    }

    const formData = new FormData();
    formData.append("employees", JSON.stringify(userList));
    formData.append("schedule_id", value);

    try {
      const result = await addEmployees({ errors: {} }, formData);
      if (result.success) {
        setError("Employees added");
        return result.employees;
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
      setError("server error");
    }
  };

  const CreateEmployes = async () => {
    if (scheduleId) {
      const empResult = await sendEmployees(scheduleId as string);
      if (empResult) {
        setEmployeesTabFilter((prev) => [...prev, ...empResult]);

        const responses = await Promise.all(
          userList.map((user_id) =>
            fetch(`/api/user/${user_id}`).then((res) => res.json())
          )
        );

        setUserList([])
        setUserRoleList([])
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        <UserSearchList
          userList={userList}
          setUserList={setUserList}
          organizationId={organizationId}
          userRoleList={userRoleList}
        />
        <UserPositionForm
          userRoleList={userRoleList}
          setUserRoleList={setUserRoleList}
        />
      </div>
      <PrimaryButton onClick={CreateEmployes}>dodaj</PrimaryButton>
    </div>
  );
}
