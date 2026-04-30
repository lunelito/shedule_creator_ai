"use client";
import AboutUs from "@/components/HomePage/AboutUs";
import Blog from "@/components/HomePage/Blog";
import Contact from "@/components/HomePage/Contact";
import LandingPage from "@/components/HomePage/LandingPage";
import OurPlan from "@/components/HomePage/OurPlan";
import NavBar from "@/components/NavBar/landingPage/NavBar";
import { useRef } from "react";

export type sectionsType = {
  id: number;
  name: string;
  ref: React.RefObject<HTMLElement | null>;
}[];

export type pagesType = {
  id: number;
  name: string;
  url: string;
}[];

export default function HomePage() {
  // bg bg-zinc-900
  // secondary bg-zinc-800

  const sectionRefs = {
    home: useRef(null),
    aboutUs: useRef(null),
    blog: useRef(null),
    contact: useRef(null),
    plan: useRef(null),
  };

  const sections: sectionsType = [
    { id: 0, name: "Home", ref: sectionRefs.home },
    { id: 1, name: "About us", ref: sectionRefs.aboutUs },
    { id: 3, name: "Blog", ref: sectionRefs.blog },
    { id: 4, name: "Contact", ref: sectionRefs.contact },
    { id: 5, name: "Our plan", ref: sectionRefs.plan },
  ];

  const pages : pagesType = [{ id: 6, name: "Log in", url: "/login" }];

  return (
    <div className="w-full min-h-screen h-fit bg-zinc-900 text-white flex flex-col overflow-auto scrollbar-thin">
      <NavBar sections={sections} pageRef={sectionRefs.home} pages={pages} />
      <LandingPage />
      <AboutUs pageRef={sectionRefs.aboutUs} />
      <Blog pageRef={sectionRefs.blog} />
      <Contact pageRef={sectionRefs.contact} />
      <OurPlan pageRef={sectionRefs.plan} />
    </div>
  );
}
