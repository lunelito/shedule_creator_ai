"use client";
import { useEffect, useState } from "react";
import React from "react";
import { linksType, OrganizationType } from "@/app/manage/layout";
import SingleStaticItem from "./SingleStaticItem";
import { useUserDataContext } from "@/context/userContext";
import SingleStaticItemOrganization from "./SingleStaticItemOrganization";

type NavBarProps = {
  organizations: OrganizationType[];
  links: linksType[];
  isPending: boolean;
};

export default function NavBar({
  organizations,
  links,
  isPending,
}: NavBarProps) {
  const [showNavBar, setShowNavbar] = useState(false);
  const [pickedSheduleComponent, setPickedSheduleComponent] =
    useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("pickedSheduleComponent");
    if (saved !== null) {
      setPickedSheduleComponent(Number(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "pickedSheduleComponent",
      pickedSheduleComponent.toString()
    );
  }, [pickedSheduleComponent]);

  const { isAdmin } = useUserDataContext();

  return (
    <div
      className=" bg-zinc-800 h-screen flex relative  w-fit"
      onMouseEnter={() => setShowNavbar(true)}
      onMouseLeave={() => setShowNavbar(false)}
    >
      <div className="flex flex-col justify-between">
        <div className=" w-fit flex  flex-col p-5 justify-between">
          <div className="w-fit  mt-5 flex flex-col gap-5 overflow-y-scroll overflow-x-hidden h-[80vh] scrollbar-none">
            {/*dashcboard*/}
            {links
              .filter((el) => el.label === "Dashboard")
              .map((el, i) => (
                <SingleStaticItem
                  key={el.id}
                  href={el.href}
                  icon={el.icon}
                  label={el.label}
                  id={el.id}
                  pickedSheduleComponent={pickedSheduleComponent}
                  setPickedSheduleComponent={setPickedSheduleComponent}
                  showNavBar={showNavBar}
                  setShowNavbar={setShowNavbar}
                />
              ))}
            {/* add */}
            {links
              .filter((el) => el.label === "New shedule")
              .map((el, i) => (
                <SingleStaticItem
                  key={el.id}
                  href={el.href}
                  icon={el.icon}
                  label={el.label}
                  id={el.id}
                  pickedSheduleComponent={pickedSheduleComponent}
                  setPickedSheduleComponent={setPickedSheduleComponent}
                  showNavBar={showNavBar}
                  setShowNavbar={setShowNavbar}
                />
              ))}
            {/* admin panel */}
            {isAdmin &&
              links
                .filter((el) => el.label === "Admin Panel")
                .map((el, i) => (
                  <SingleStaticItem
                    key={el.id}
                    href={el.href}
                    icon={el.icon}
                    label={el.label}
                    id={el.id}
                    pickedSheduleComponent={pickedSheduleComponent}
                    setPickedSheduleComponent={setPickedSheduleComponent}
                    showNavBar={showNavBar}
                    setShowNavbar={setShowNavbar}
                  />
                ))}
            {/* shedules */}
            {isPending
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    className="flex items-center justify-between p-2 rounded-2xl bg-zinc-700 animate-pulse"
                    key={i}
                  >
                    <div className="h-9 w-9 m-1 shrink-0 flex items-center justify-center">
                      <div className="h-11 w-11 bg-zinc-600 rounded-full"></div>
                    </div>
                  </div>
                ))
              : organizations
                  .filter((el) => el.id > 2)
                  .map((el) => (
                    <SingleStaticItemOrganization
                      key={el.id}
                      href={`/manage/organization/${el.id}`}
                      icon={el.icon}
                      label={el.name}
                      id={el.id}
                      pickedSheduleComponent={pickedSheduleComponent}
                      setPickedSheduleComponent={setPickedSheduleComponent}
                      showNavBar={showNavBar}
                      setShowNavbar={setShowNavbar}
                    />
                  ))}
          </div>
        </div>
        <div className="w-fit mt-5 flex flex-col p-5 overflow-y-scroll overflow-x-hidden scrollbar-none">
          {/* account / settings */}
          {links
            .filter((el) => el.label === "Account")
            .map((el, i) => (
              <SingleStaticItem
                key={el.id}
                href={el.href}
                icon={el.icon}
                label={el.label}
                id={el.id}
                pickedSheduleComponent={pickedSheduleComponent}
                setPickedSheduleComponent={setPickedSheduleComponent}
                showNavBar={showNavBar}
                setShowNavbar={setShowNavbar}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
