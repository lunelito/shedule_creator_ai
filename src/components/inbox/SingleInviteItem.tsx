import { inviteDatatype } from "@/app/manage/settings/inbox/page";
import { useOrganizationContext } from "@/context/organizationsContext";
import { organizations } from "@/db/schema";
import { editEmployeeInvite } from "@/lib/actions/Schedule/editEmployeeInvite";
import { InferSelectModel } from "drizzle-orm";
import React, { SetStateAction, useEffect, useState } from "react";
type SingleInviteItemType = {
  invite: inviteDatatype;
  setInviteData: React.Dispatch<SetStateAction<inviteDatatype[]>>;
  setError: React.Dispatch<SetStateAction<string>>;
  organization: InferSelectModel<typeof organizations>[];
};
export default function SingleInviteItem({
  invite,
  setInviteData,
  setError,
  organization,
}: SingleInviteItemType) {
  const [decision, setDecision] = useState<"declined" | "accepted" | null>(
    null
  );
  const { setOrganizationsData } = useOrganizationContext();
  const [pending, setPending] = useState<boolean>(false);

  const Accept = async () => {
    const formData = new FormData();
    formData.append("invite", JSON.stringify(invite));
    formData.append("decision", decision as string);
    try {
      const result = await editEmployeeInvite({ errors: {} }, formData);
      if (result.success && result.errors?._form?.[0]) {

        setOrganizationsData((prev) => {
          const orgExists = prev.some(
            (org) => org.id === invite.organization_id
          );
          if (orgExists) return prev;

          const newOrg = organization.find(
            (org) => org.id === invite.organization_id
          );

          return newOrg ? [...prev, newOrg] : prev;
        });

        setError(result.errors._form[0]);

        setTimeout(() => {
          setInviteData((prev) =>
            prev.filter((el) => el.employee_id !== result.employee?.id)
          );
          setError("");
        }, 2000);

      }
    } catch (e) {
      // console.log(e);
    }
  };

  console.log;

  useEffect(() => {
    if (decision !== null) {
      setPending(true);
      Accept();
    }
  }, [decision]);

  return (
    <div
      className={`text-white flex flex-col gap-4 w-full p-5 border-1 rounded-2xl hover:border-teal-600 transition-all ease-in-out ${
        pending ? "opacity-75" : ""
      }`}
    >
      <div className="flex justify-between">
        <p className="text-[clamp(1rem,2vw,2rem)]">
          {invite.organization[0].toUpperCase() + invite.organization.slice(1)}{" "}
          invited you to their schedule!
        </p>
        <p>{invite.when}</p>
      </div>
      <div>
        <p>
          You were added to{" "}
          {invite.schedule[0].toUpperCase() + invite.schedule.slice(1)} as a{" "}
          {invite.role} on position named {invite.position}
        </p>
      </div>
      <div className="flex gap-4">
        <button
          disabled={pending}
          className="bg-teal-600 py-1 px-3 rounded hover:scale-105 transition-all ease-in-out"
          onClick={() => setDecision("accepted")}
        >
          {pending ? "Loading..." : "Accept"}
        </button>
        <button
          disabled={pending}
          className="bg-red-600 py-1 px-3 rounded hover:scale-105 transition-all ease-in-out"
          onClick={() => setDecision("declined")}
        >
          {pending ? "Loading..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
