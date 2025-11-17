import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";

type UserRoleFormType = {
  userRoleList: string[];
  setUserRoleList: Dispatch<SetStateAction<string[]>>;
};

export default function UserRoleForm({
  userRoleList,
  setUserRoleList,
}: UserRoleFormType) {
  const [role, setRole] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setUserRoleList((prev) => [...prev, role]);
    setRole("");
  };

  const deleteRole = (i: number) => {
    setUserRoleList(userRoleList.filter((el, id) => id !== i));
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={role}
          placeholder="Add roles to your employees..."
          onChange={(e) => setRole(e.target.value)}
          className="flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:scale-105 transition-all ease-in-out disabled:opacity-75 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </form>
      <hr className="m-5 mt-10 mb-10" />
      {userRoleList.length > 0 ? (
        <div className="ml-10 mr-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {userRoleList.map((role, i) => (
            <div
              key={i}
              onClick={() => deleteRole(i)}
              className="flex items-center justify-center p-3 rounded border-1 hover:scale-105 transition-all ease-in-out hover:bg-teal-600 hover:border-teal-600"
            >
              {role}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <p>No roles added</p>
        </div>
      )}
      <hr className="m-5 mt-10 mb-10" />
    </div>
  );
}
