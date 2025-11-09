import React, { useState, useEffect } from "react";
import { InferSelectModel } from "drizzle-orm";
import { users } from "@/db/schema";
import useFetch from "@/hooks/useFetch";

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(emailVal);
    }, 500);
    return () => clearTimeout(handler);
  }, [emailVal]);

  const email = "bob";

  const { data, error, isPending } = useFetch<InferSelectModel<typeof users>[]>(
    debouncedQuery != "" ? `/api/users/${debouncedQuery}` : null
  );

  return (
    <div>
      <input
        type="text"
        value={emailVal}
        placeholder="Wpisz e-mail..."
        onChange={(e) => setEmail(e.target.value)}
      />
      {isPending ? (
        <p>Loading...</p>
      ) : error ? (
        <p>User not found</p>
      ) : data && data.length > 0 ? (
        <ul>
          {emailVal.length > 0 &&
            data.map((user: any) => <li key={user.id}>{user.email}</li>)}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}
