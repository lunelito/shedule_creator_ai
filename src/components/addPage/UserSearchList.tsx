import React, { useState, useEffect, FormEvent } from "react";
import { InferSelectModel } from "drizzle-orm";
import { users } from "@/db/schema";
import useFetch from "../../../hooks/useFetch";
import SelectGroup from "../UI/SelectGroup";
import NumberPicker from "../UI/NumberPicker";

type TypeUserSearchList = {
  userList: InferSelectModel<typeof users>[];
  setUserList: React.Dispatch<
    React.SetStateAction<InferSelectModel<typeof users>[]>
  >;
};

export default function UserSearchList({
  userList,
  setUserList,
}: TypeUserSearchList) {
  const [emailVal, setEmail] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState(emailVal);
  const [shouldFetch, setShouldFetch] = useState(false);

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
      const userToAdd = data[0];
      if (!userList.find((user) => user.id === userToAdd.id)) {
        setUserList((prev) => [...prev, userToAdd]);
        setEmail("");
      }
    }
  };

  const handleAddUser = (user: InferSelectModel<typeof users>) => {
    if (!userList.find((u) => u.id === user.id)) {
      setUserList((prev) => [...prev, user]);
      setEmail("");
    }
  };

  const removeUser = (userId: number) => {
    setUserList((prev) => prev.filter((user) => user.id !== userId));
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
      <div>
        <hr className="m-5 mt-10  mb-10" />
        <ul className="space-y-2">
          {userList.length > 0 ? (
            userList.map((user) => (
              <li
                key={user.id}
                className="flex flex-wrap p-3 justify-between items-center gap-4 rounded ml-10 mr-10"
              >
                <span>
                  {user.email} - {user.name}
                </span>
                <button
                  onClick={() => removeUser(user.id)}
                  className="px-2 py-1 bg-teal-600 text-white text-sm rounded hover:scale-105 transition-all ease-in-out"
                >
                  Remove
                </button>
                {/* test */}
                <SelectGroup
                  options={["Opcja 1", "Opcja 2", "Opcja 3"]}
                  title="Contract Type"
                />
                <SelectGroup
                  options={["Opcja 1", "Opcja 2", "Opcja 3"]}
                  title="max_consecutive_days"
                />
                <NumberPicker
                  title="contracted_hours_per_week"
                  orientation="horizontal"
                  rangeDefault={1}
                  from={1}
                  to={7}
                />
                <NumberPicker
                  title="contracted_hours_per_week"
                  orientation="vertical"
                  rangeDefault={1}
                  from={1}
                  to={7}
                />
                {/* test */}
              </li>
            ))
          ) : (
            <div className="flex justify-center">
              <p>no aded users</p>
            </div>
          )}
        </ul>
      </div>
      <hr className="m-5 mt-10 mb-10" />

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
