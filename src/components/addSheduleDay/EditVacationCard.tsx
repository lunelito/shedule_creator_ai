import { ShiftFetched } from "@/app/manage/add/addSheduleDay/page";
import { employees, time_off_requests } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { SetStateAction } from "react";
import PrimaryButton from "../UI/PrimaryButton";
import { deleteSingleScheduleDay } from "@/lib/actions/ScheduleDay/deleteSingleScheduleDay";
import {
  fromReadableToValue,
  fromValueToReadable,
} from "@/lib/hooks/useTimeOff";
import { deleteVacation } from "@/lib/actions/Vacations/deleteVacation";
import DeleteIcon from "../UI/DeleteIcon";

type SheduleCardType = {
  fetchedShift: ShiftFetched | undefined;
  addShow: boolean;
  editleShow: boolean;
  emp: InferSelectModel<typeof employees>;
  cantWork: boolean;
  timeOff: InferSelectModel<typeof time_off_requests> | undefined;
  setTimeOffRequestsData: React.Dispatch<
    SetStateAction<InferSelectModel<typeof time_off_requests>[]>
  >;
  scheduleId: string | null;
  setEditleShow: React.Dispatch<SetStateAction<boolean>>;
  setError: React.Dispatch<SetStateAction<string>>;
};

export default function EditVacationCard({
  emp,
  timeOff,
  editleShow,
  scheduleId,
  setTimeOffRequestsData,
  setEditleShow,
  setError,
}: SheduleCardType) {
  const deleteDay = async (id: number) => {
    try {
      if (timeOff && scheduleId) {
        const result = await deleteVacation(id, scheduleId);
        if (result.success) {
          setError(result.errors?._form?.[0] ?? "");
          setTimeOffRequestsData((prev) => prev.filter((el) => el.id !== id));
          setTimeout(() => {
            setError("");
            setEditleShow(false);
          }, 2000);
        }
      }
    } catch (e: any) {
      setError(e?.message ?? "server error");
    }
  };

  return (
    <div className="w-full p-5 border border-teal-600 rounded-lg relative">
      <h2 className="text-xl mb-5 m-2 text-center">
        {emp.name || "Unknown User"} - {emp.id}
        <br />
        <span className="text-sm text-gray-400">{emp.email || "No email"}</span>
      </h2>
      <div className="flex justify-center items-center flex-col">
        {timeOff && (
          <div>
            <p className="text-center text-teal-600 text-xl font-bold">
              {fromValueToReadable(timeOff.type, "_")}
            </p>
          </div>
        )}
      </div>
      {timeOff?.id && editleShow && (
        <DeleteIcon
          onClick={() => deleteDay(timeOff.id)}
          bgColor={"bg-teal-600"}
          size="M"
        />
      )}
    </div>
  );
}
