import { Fragment } from "react";
import { AnimatePresence } from "framer-motion";
import UserDetails from "./UserDetails";
import { InferSelectModel } from "drizzle-orm";
import { users } from "@/db/schema";
import { employeType } from "@/app/manage/add/schedule/page";
import SlideFromBottomListAnimation from "@/animations/SlideFromBottomListAnimation";
import IconButton from "../UI/IconButton";

type UserItemProps = {
  index: number;
  lastIndex: number;
  isOpen: boolean;
  toggleUserOpen: (id: number) => void;
  removeUser: (id: number) => void;
  userList: employeType[];
  user: employeType;
  setUserList: React.Dispatch<React.SetStateAction<employeType[]>>;
  organizationId: string | null;
  userRoleList: string[];
};

export default function UserItem({
  user,
  index,
  lastIndex,
  isOpen,
  toggleUserOpen,
  removeUser,
  organizationId,
  userList,
  userRoleList,
  setUserList,
}: UserItemProps) {
  return (
    <Fragment>
      <li className="flex flex-col w-full justify-between items-start md:items-center gap-4 p-4 md:p-6">
        <div className="flex w-full p-3 justify-center gap-5 items-center">
          <span>
            {user.email} - {user.name}
          </span>

          <IconButton
            onClick={() => toggleUserOpen(user.user_id)}
            tailwindPropsImage="hover:rotate-180"
            src="/Icons/arrowIcon.svg"
          />

          {user.role !== "admin" && (
            <IconButton
              onClick={() => removeUser(user.user_id)}
              src="/Icons/cross.svg"
            />
          )}
        </div>

        <AnimatePresence>
          {isOpen && (
            <SlideFromBottomListAnimation
             userId={user.user_id}>
              <UserDetails
                isOpen={isOpen}
                organizationId={organizationId}
                setUserList={setUserList}
                user={user}
                userList={userList}
                userRoleList={userRoleList}
              />
            </SlideFromBottomListAnimation>
          )}
        </AnimatePresence>
      </li>

      {index !== lastIndex && <hr className="m-15 mt-10 mb-5" />}
    </Fragment>
  );
}
