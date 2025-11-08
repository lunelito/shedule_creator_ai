import React from "react";
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
  const email = "bob";
  const { data, error, isPending } = useFetch(`/api/users/${email}`);
  console.log(data,error)
  return <div></div>;
}
