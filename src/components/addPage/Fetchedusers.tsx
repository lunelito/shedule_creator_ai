import { users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { SetStateAction } from "react";
import Loader from "../UI/Loader";

type FetchedUsersType = {
  isPending: boolean;
  shouldFetch: boolean;
  error: string | null;
  displayData: InferSelectModel<typeof users>[] | null;
  emailVal: string;
  setEmail:React.Dispatch<SetStateAction<string>>
  handleAddUser: (user: InferSelectModel<typeof users>) => void;
};

export default function Fetchedusers({
  isPending,
  shouldFetch,
  error,
  displayData,
  emailVal,
  setEmail,
  handleAddUser,
}: FetchedUsersType) {
  if (isPending && shouldFetch)
    return <Loader/>;

  if (error && shouldFetch)
    return <p className="text-white text-center p-2">User not found</p>;

  if (displayData && displayData.length > 0 && emailVal.length > 0)
    return (
      <div className="rounded-md p-10">
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
                onClick={() => {
                  handleAddUser(user);
                  setEmail("");
                }}
                className="px-2 py-1 bg-teal-600 text-white text-sm rounded hover:scale-105 transition-all ease-in-out"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>
    );

  if (emailVal.length > 0 && shouldFetch)
    return <p className="text-white text-center p-2">No users found</p>;

  return null;
}
