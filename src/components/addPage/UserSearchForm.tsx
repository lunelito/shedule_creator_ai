import React, { useState, useEffect, FormEvent, Fragment } from "react";
import { InferSelectModel } from "drizzle-orm";
import { users } from "@/db/schema";
import useFetch from "../../../hooks/useFetch";
import SelectGroup from "../UI/SelectGroup";
import NumberPicker from "../UI/NumberPicker";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import SlideFronBottomListAnimation from "@/animations/SlideFromBottomListAnimation";
import { employeType } from "@/app/manage/add/schedule/page";
import Input from "../UI/Input";
import SecondaryButton from "../UI/SecondaryButton";
import UserDetails from "./UserDetails";
import Fetchedusers from "./Fetchedusers";
import UserItem from "./UserItem";

type TypeUserSearchList = {
  userList: employeType[];
  setUserList: React.Dispatch<React.SetStateAction<employeType[]>>;
  organizationId: string | null;
  userRoleList: string[];
};

export default function UserSearchList({
  userList,
  setUserList,
  organizationId,
  userRoleList,
}: TypeUserSearchList) {
  const [emailVal, setEmail] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState(emailVal);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [openUsers, setOpenUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(emailVal);
      setShouldFetch(emailVal.length > 0);
    }, 500);
    return () => clearTimeout(handler);
  }, [emailVal]);

  const { data, error, isPending } = useFetch<InferSelectModel<typeof users>[]>(
    shouldFetch ? `/api/users/${debouncedQuery}` : null
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Dodaj sprawdzenie czy input nie jest pusty
    if (data && data.length > 0 && emailVal.trim() !== "") {
      const userData = data[0];
      if (!userList.find((user) => user.user_id === userData.id)) {
        setUserList((prev) => [
          ...prev,
          {
            email: userData.email!,
            name: userData.name!,
            user_id: userData.id,
            employee_code: "",
            organization_id: Number(organizationId ?? 0),
            default_hourly_rate: 1,
            contract_type: "full_time",
            contracted_hours_per_week: 1,
            max_consecutive_days: 1,
            role: "employee",
            position: userRoleList.length > 0  ? userRoleList[0] : "",
          },
        ]);
        setEmail("");
      }
    }
  };

  const handleAddUser = (user: InferSelectModel<typeof users>) => {
    if (!userList.find((u) => u.user_id === user.id)) {
      setUserList((prev) => [
        ...prev,
        {
          email: user.email,
          name: user.name ?? "",
          user_id: user.id,
          employee_code: "",
          organization_id: Number(organizationId ?? 0),
          default_hourly_rate: 1,
          contract_type: "full_time",
          contracted_hours_per_week: 1,
          max_consecutive_days: 1,
          role: "employee",
          position: userRoleList.length > 0  ? userRoleList[0] : "",
        },
      ]);
      setEmail("");
    }
  };

  const removeUser = (userId: number) => {
    setUserList((prev) => prev.filter((user) => user.user_id !== userId));
  };

  const toggleUserOpen = (id: number) => {
    setOpenUsers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

useEffect(() => {
  if (userRoleList.length > 0) {
    setUserList(prev =>
      prev.map(el => ({
        ...el,
        position: userRoleList[0]
      }))
    );
  }
}, [userRoleList]);


  const displayData = shouldFetch ? data : null;

  return (
    <div className="w-full p-2">
      <p className=" text-lg mb-4">Employee List</p>
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          type="text"
          value={emailVal}
          placeholder="Type e-mail..."
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
        <button
          type="submit"
          disabled={
            !displayData || displayData.length === 0 || emailVal.trim() === ""
          }
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:scale-105 transition-all ease-in-out disabled:opacity-75 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </form>
        <ul className="border-b-1 border-t-1 py-1 px-1 mt-10 mb-10">
          {emailVal.length > 0 ? (
            <Fetchedusers
              setEmail={setEmail}
              displayData={displayData}
              emailVal={emailVal}
              error={error}
              handleAddUser={handleAddUser}
              isPending={isPending}
              shouldFetch={shouldFetch}
            />
          ) : userList.length > 0 ? (
            userList.map((user, i) => (
              <UserItem
                key={user.user_id}
                user={user}
                index={i}
                lastIndex={userList.length - 1}
                isOpen={openUsers[user.user_id]}
                toggleUserOpen={toggleUserOpen}
                removeUser={removeUser}
                organizationId={organizationId}
                userList={userList}
                userRoleList={userRoleList}
                setUserList={setUserList}
              />
            ))
          ) : (
            <div className="flex justify-center">
              <p className="p-5">no added users</p>
            </div>
          )}
        </ul>
    </div>
  );
}
