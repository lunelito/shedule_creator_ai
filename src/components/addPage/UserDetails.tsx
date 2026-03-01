import React from "react";
import SelectGroup from "../UI/SelectGroup";
import Input from "../UI/Input";
import NumberPicker from "../UI/NumberPicker";
import { employeType } from "@/app/manage/add/schedule/page";

type UserDetailsType = {
  isOpen: boolean;
  userList: employeType[];
  user: employeType;
  setUserList: React.Dispatch<React.SetStateAction<employeType[]>>;
  organizationId: string | null;
  userRoleList: string[];
};

export default function UserDetails({
  isOpen,
  user,
  organizationId,
  userList,
  setUserList,
  userRoleList,
}: UserDetailsType) {
  return (
    <div className={`${isOpen ? "block" : "hidden"} flex gap-5 m-5`}>
      <div className="flex flex-col justify-between">
        {/* user id  */}
        <input type="hidden" value={user.user_id} />
        {/* organization */}
        <input type="hidden" value={organizationId || " "} />
        {/* contract type */}
        {user.role !== "admin" && (
          <SelectGroup
            options={["manager", "supervisor", "employee"]}
            title="Role"
            onChange={(option) => {
              setUserList((prev) =>
                prev.map((u) =>
                  u.user_id === user.user_id ? { ...u, role: option } : u
                )
              );
            }}
          />
        )}
        <SelectGroup
          options={userRoleList}
          title="Position"
          onChange={(option) => {
            setUserList((prev) =>
              prev.map((u) =>
                u.user_id === user.user_id ? { ...u, position: option } : u
              )
            );
          }}
        />
        <SelectGroup
          options={["full_time", "part_time", "hourly", "contractor"]}
          title="Contract Type"
          onChange={(option) => {
            setUserList((prev) =>
              prev.map((u) =>
                u.user_id === user.user_id ? { ...u, contract_type: option } : u
              )
            );
          }}
        />
        <Input
          key={user.user_id + "-employee_code"}
          type="text"
          name={"employee_code" + user.user_id}
          text="employee code"
          value={user.employee_code}
          onChange={(val) =>
            setUserList((prev) =>
              prev.map((u) =>
                u.user_id === user.user_id ? { ...u, employee_code: val } : u
              )
            )
          }
        />
      </div>
      <div className="flex flex-col">
        {/*default_hourly_rate*/}
        <NumberPicker
          title="default_hourly_rate"
          orientation="horizontal"
          rangeDefault={30}
          from={1}
          to={100}
          onChange={(option) => {
            setUserList((prev) =>
              prev.map((u) =>
                u.user_id === user.user_id
                  ? {
                      ...u,
                      default_hourly_rate: option,
                    }
                  : u
              )
            );
          }}
        />
        {/* contracted_hours_per_week */}
        <NumberPicker
          title="contracted_hours_per_week"
          orientation="horizontal"
          rangeDefault={40}
          from={1}
          to={120}
          onChange={(option) => {
            setUserList((prev) =>
              prev.map((u) =>
                u.user_id === user.user_id
                  ? {
                      ...u,
                      contracted_hours_per_week: option,
                    }
                  : u
              )
            );
          }}
        />
        {/* max_consecutive_days */}
        <NumberPicker
          title="max_consecutive_days"
          orientation="horizontal"
          rangeDefault={5}
          from={1}
          to={7}
          onChange={(option) => {
            setUserList((prev) =>
              prev.map((u) =>
                u.user_id === user.user_id
                  ? {
                      ...u,
                      max_consecutive_days: option,
                    }
                  : u
              )
            );
          }}
        />
      </div>
    </div>
  );
}
