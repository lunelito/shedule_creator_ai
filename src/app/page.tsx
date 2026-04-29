"use client";
import LandingPage from "@/components/HomePage/LandingPage";
import Section from "@/components/HomePage/Section";
import NavBar from "@/components/NavBar/landingPage/NavBar";

export default function HomePage() {
  // bg bg-zinc-900
  // secondary bg-zinc-800

  return (
    <div className="w-full min-h-screen h-fit bg-zinc-900 text-white flex flex-col overflow-auto scrollbar-thin">
      <NavBar />
      <LandingPage />
      <Section />
    </div>
  );
}
