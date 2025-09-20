import ManagePage from "@/components/NavBar/ManagePage";
import NavBar from "@/components/NavBar/NavBar";

export type scheduleType = {
  icon: string;
  text: string;
};

export default function Home() {
  const schedules: scheduleType[] = [];

  return (
    <div className="flex justify-center items-center h-screen">
      <NavBar schedules={schedules} />
      <ManagePage />
    </div>
  );
}
