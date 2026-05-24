import { ParamValue } from "next/dist/server/request/params";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type AddNewScheduleCard = {
  organizationId: ParamValue;
  containerSize: number;
};

export default function AddNewScheduleCard({
  organizationId,
  containerSize,
}: AddNewScheduleCard) {
  const router = useRouter();
  return (
    <div
      style={{
        height: containerSize ? `${containerSize}px` : "300px",
      }}
      className="border-2 flex-col items-center border-dotted border-zinc-600 p-4 gap-1 md:p-6 rounded-xl md:rounded-2xl flex justify-center transition-transform duration-300 hover:-translate-y-2"
      onClick={() =>
        router.push(`/manage/add/schedule?organizationId=${organizationId}`)
      }
    >
      <Image
        alt="addSchedlue"
        src={"/Icons/addIcon.svg"}
        width={30}
        height={30}
        className="mb-4"
      />
      <p>New schedule</p>
      <p className="flex">
        Create a new department{" "}
        <Image
          alt="addSchedlue"
          src={"/Icons/ArrowRight.svg"}
          width={20}
          height={20}
        />
      </p>
    </div>
  );
}
