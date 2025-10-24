import RenderNavBar from "@/animations/RenderNavBar";
import NavBar from "@/components/NavBar/NavBar";
import { AnimatePresence } from "framer-motion";

export type scheduleType = {
  icon: string;
  label: string;
  slug: string;
  id: number;
};

export type linksType = {
  href: string;
  icon: string;
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
    { href: "/manage/add", icon: "addIcon", label: "New shedule", id: 2 },
  ];

  const schedules: scheduleType[] = [
    { icon: "accountIcon", slug: "test1", label: "test", id: 3 },
    { icon: "accountIcon", slug: "test2", label: "test", id: 4 },
  ];

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-900 ">
      {/* Lewy pasek nawigacyjny */}
      <aside>
        <RenderNavBar animationKey={"nav"}>
          <NavBar links={links} schedules={schedules} />
        </RenderNavBar>
      </aside>

      {/* Główna zawartość */}
      <main className="h-screen w-full flex justify-center items-center text-white">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </main>
    </div>
  );
}
