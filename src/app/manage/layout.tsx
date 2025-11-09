"use client";

import RenderNavBar from "@/animations/RenderNavBar";
import NavBar from "@/components/NavBar/NavBar";
import { useUserDataContext } from "@/context/userContext";
import { organizations } from "@/db/schema";
import useFetch from "@/hooks/useFetch";
import { InferSelectModel } from "drizzle-orm";
import { AnimatePresence } from "framer-motion";

export type OrganizationType = InferSelectModel<typeof organizations>;

export type linksType = {
  href: string;
  icon: string | null;
  label: string;
  id: number;
};

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links: linksType[] = [
    { href: "/manage/main", icon: "menu", label: "Dashboard", id: 0 },
    { href: "/manage/settings", icon: "accountIcon", label: "Account", id: 1 },
    {
      href: "/manage/add/organization",
      icon: "addIcon",
      label: "New shedule",
      id: 2,
    },
  ];

  const { userData } = useUserDataContext();

  const { data, isPending, error } = useFetch(
    userData?.id ? `/api/organizations/${userData.id}` : null
  );

  console.log(isPending);

  const organizationsData: OrganizationType[] =
    (data as OrganizationType[]) || [];

  return (
    <div className="flex justify-center w-full items-center h-screen bg-zinc-900 ">
      <aside>
        <RenderNavBar animationKey={"nav"}>
          <NavBar links={links} organizations={organizationsData} isPending={isPending}/>
        </RenderNavBar>
      </aside>

      <main className="h-screen w-full flex justify-center items-center text-white overflow-y-hidden">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </main>
    </div>
  );
}
