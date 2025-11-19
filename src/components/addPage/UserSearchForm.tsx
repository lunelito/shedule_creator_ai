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
            organization_id: Number(organizationId ?? 0),
            default_hourly_rate: 1,
            contract_type: "",
            contracted_hours_per_week: 1,
            max_consecutive_days: 1,
            role: "employee",
            position: "",
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
          organization_id: Number(organizationId ?? 0),
          default_hourly_rate: 1,
          contract_type: "",
          contracted_hours_per_week: 1,
          max_consecutive_days: 1,
          role: "employee",
          position: "",
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

  const displayData = shouldFetch ? data : null;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
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
      {/* export const employees = pgTable("employees", {
        contracted_hours_per_week: numeric("contracted_hours_per_week", {
          precision: 5,
          scale: 2,
        }).default("40"),
        max_consecutive_days: integer("max_consecutive_days").default(7),
      }); */}
      <div>
        <hr className="m-5 mt-10  mb-5" />
        <ul className="space-y-2">
          {userList.length > 0 ? (
            userList.map((user, i) => {
              const isOpen = openUsers[user.user_id] || false;
              return (
                <Fragment key={user.user_id}>
                  <li className="flex flex-col w-full justify-between items-start md:items-center gap-4 p-4 md:p-6 ">
                    <div
                      className={`flex w-full p-3 justify-center gap-10 items-center`}
                    >
                      <span>
                        {user.email} - {user.name}
                      </span>
                      <button
                        onClick={() => toggleUserOpen(user.user_id)}
                        className="flex justify-center items-center w-10 h-10 bg-teal-600 text-white text-sm rounded hover:scale-105 transition-all ease-in-out"
                      >
                        <div className="relative w-10 h-10 invert hover:rotate-180 transition-all">
                          <Image src="/Icons/arrowIcon.svg" alt="arrow" fill />
                        </div>
                      </button>
                    </div>
                    <AnimatePresence>
                      {isOpen && (
                        <SlideFronBottomListAnimation userId={user.user_id}>
                          <div
                            className={`${
                              isOpen ? "block" : "hidden"
                            } flex flex-col gap-5`}
                          >
                            {userList.indexOf(user) != 0 && (
                              <button
                                onClick={() => removeUser(user.user_id)}
                                className="px-2 py-1 bg-teal-600 text-white text-sm rounded hover:scale-105 transition-all ease-in-out"
                              >
                                Remove from list
                              </button>
                            )}
                            {/* user id  */}
                            <input type="hidden" value={user.user_id} />
                            {/* organization */}
                            <input
                              type="hidden"
                              value={organizationId || " "}
                            />
                            {/* contract type */}
                            {userList.indexOf(user) != 0 && (
                              <SelectGroup
                                options={[
                                  "manager",
                                  "supervisor",
                                  "employee",
                                  "admin",
                                ]}
                                title="Role"
                                onChange={(option) => {
                                  setUserList((prev) =>
                                    prev.map((u) =>
                                      u.user_id === user.user_id
                                        ? { ...u, role: option }
                                        : u
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
                                    u.user_id === user.user_id
                                      ? { ...u, contract_type: option }
                                      : u
                                  )
                                );
                              }}
                            />
                            <SelectGroup
                              options={[
                                "full_time",
                                "part_time",
                                "hourly",
                                "contractor",
                              ]}
                              title="Contract Type"
                              onChange={(option) => {
                                setUserList((prev) =>
                                  prev.map((u) =>
                                    u.user_id === user.user_id
                                      ? { ...u, contract_type: option }
                                      : u
                                  )
                                );
                              }}
                            />
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
                        </SlideFronBottomListAnimation>
                      )}
                    </AnimatePresence>
                  </li>
                  {!(i === userList.length - 1) && (
                    <hr className="m-15 mt-10 mb-5" />
                  )}
                </Fragment>
              );
            })
          ) : (
            <div className="flex justify-center">
              <p>no aded users</p>
            </div>
          )}
        </ul>
      </div>
      <hr className="m-5 mt-5 mb-10" />

      {isPending && shouldFetch ? (
        <p className="text-white">Loading...</p>
      ) : error && shouldFetch ? (
        <p className="text-white">User not found</p>
      ) : displayData && displayData.length > 0 && emailVal.length > 0 ? (
        <div className="border rounded-md p-2">
          <ul className="space-y-1">
            {displayData.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center p-2 hover:bg-teal-500 rounded"
              >
                <span>
                  {user.email} - {user.name}
                </span>
                <button
                  onClick={() => handleAddUser(user)}
                  className="px-2 py-1 bg-teal-600 text-white text-sm rounded hover:scale-105 transition-all ease-in-out"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : emailVal.length > 0 && shouldFetch ? (
        <p className="text-gray-500">No users found</p>
      ) : null}
    </div>
  );
}
