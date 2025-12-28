"use client";
import RenderAnimation from "@/animations/RenderAnimation";
import React, { useActionState, useEffect, useState } from "react";
import * as actions from "@/lib/actions/action";
import { FieldsType } from "@/lib/actions/types/auth";
import { AnimatePresence } from "framer-motion";
import Input from "@/components/UI/Input";
import FadeAnimation from "@/animations/FadeAnimation";
import PrimaryButton from "@/components/UI/PrimaryButton";
import FileInput from "@/components/UI/FileInput";
import IconPicker from "@/components/addPage/IconPicker";
import { useUserDataContext } from "@/context/userContext";
import { useOrganizationContext } from "@/context/organizationsContext";
import { useParams } from "next/navigation";
import ErrorConatiner from "@/components/UI/ErrorConatiner";

export default function AddPageShedule() {
  const [formState, action, isPending] = useActionState(
    actions.addOrganization,
    { errors: {} }
  );

  const { userData } = useUserDataContext();

  const { setOrganizationsData } = useOrganizationContext();

  const [icon, setIcon] = useState("");

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fields: FieldsType = [
    {
      type: "text",
      name: "organization",
      text: "Name",
      isInvalid: !!formState.errors.name,
      errorMessage: formState.errors.name ?? [],
    },
    {
      type: "file",
      name: "icon",
      text: "Icons",
      isInvalid: !!formState.errors.icon,
      errorMessage: formState.errors.icon ?? [],
    },
  ];

  const formError = formState.errors._form;

  useEffect(() => {
    if (formState.success) {
      setOrganizationsData((prev) => [...prev, formState.data]);
    }
  }, [formState]);

  return (
    <RenderAnimation animationKey={"AddPage"}>
      <form
        action={action}
        className="flex w-full h-full flex-col p-10 md:flex-row justify-center items-center"
      >
        <div className="h-full flex p-10 flex-col justify-center items-center gap-10 w-[50vw]">
          <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-3 text-teal-500">
            <h1 className="text-[clamp(1rem,6vw,2rem)] font-bold text-center sm:text-left">
              Create Organization
            </h1>
            <ErrorConatiner error={formError?.[0]} />
          </div>
          <div className="w-full flex flex-col gap-5">
            {fields.map((el, i) =>
              el.type == "file" ? (
                <IconPicker
                  key={i}
                  name={el.name}
                  isPending={isPending}
                  icon={icon}
                  text={el.text}
                  setIcon={setIcon}
                  isInvalid={el.isInvalid}
                  errorMessage={el.errorMessage}
                />
              ) : (
                <Input
                  key={i}
                  type={el.type}
                  name={el.name}
                  text={el.text}
                  isInvalid={el.isInvalid}
                  errorMessage={el.errorMessage}
                  isPending={isPending}
                />
              )
            )}

            <input type="hidden" name="timezone" value={timezone} />
            <input type="hidden" name="created_by" value={userData?.id || ""} />
          </div>
          <PrimaryButton isPending={isPending}>Create</PrimaryButton>
        </div>
      </form>
    </RenderAnimation>
  );
}
