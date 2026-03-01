import SecondaryButton from "@/components/UI/SecondaryButton";
import SecondaryInput from "@/components/UI/SecondaryInput";
import SelectGroup from "@/components/UI/SelectGroup";
import { addVacations } from "@/lib/actions/Vacations/addVacations";
import React, { SetStateAction, useState } from "react";
import { vacations } from "../ClassicCalendarEmployeeSchifts";
import { ParamValue } from "next/dist/server/request/params";
import { InferSelectModel } from "drizzle-orm";
import { time_off_requests } from "@/db/schema";

type VacationExtensionType = {
  calendarHeight: number;
  vacationsMap: string[];
  setVacationType: React.Dispatch<SetStateAction<string>>;
  setError: React.Dispatch<SetStateAction<string>>;
  vacations: vacations[];
  setVacations: React.Dispatch<SetStateAction<vacations[]>>;
  scheduleId: ParamValue;
  employeeId: ParamValue;
  setTimeOffRequestsData: React.Dispatch<
    SetStateAction<InferSelectModel<typeof time_off_requests>[]>
  >;
};

export default function VacationExtension({
  calendarHeight,
  vacationsMap,
  setVacationType,
  setError,
  vacations,
  scheduleId,
  employeeId,
  setVacations,
  setTimeOffRequestsData,
}: VacationExtensionType) {
  const [reason, setReason] = useState<string>("");

  const requestVacation = async () => {
    if (vacations.length === 0) {
      setError("Fill your vacation time!");
      setTimeout(() => setError(""), 2000);
      return 0;
    }

    if (scheduleId === undefined || employeeId === undefined) {
      setError("Please wait for your data!");
      setTimeout(() => setError(""), 2000);
      return 0;
    }

    if (reason.length === 0) {
      setError("Fill your reason field!");
      setTimeout(() => setError(""), 2000);
      return 0;
    }

    const formData = new FormData();

    formData.append("vacations", JSON.stringify(vacations));
    formData.append("schedule_id", scheduleId.toString());
    formData.append("employee_id", employeeId?.toString());
    formData.append("reason", reason);

    try {
      const result = await addVacations({ errors: {} }, formData);
      console.log(result);
      if (result.success) {
        setError("Vacation request send");
        setTimeOffRequestsData((prev) => [...prev, ...result.vacations]);
        setVacations([]);
        setTimeout(() => setError(""), 2000);
      } else {
        const vacationErrors = result.errors.vacations?.[0]
          ? result.errors.vacations[0] + " in vacations fields"
          : null;
        const formError =
          result.errors._form?.[0] ?? "Error while inserting vacations";

        setError(vacationErrors ?? formError);
      }
    } catch (err) {
      console.error(err);
      setError("server error");
    }
  };

  return (
    <div
      style={{ height: calendarHeight }}
      className="w-[20vw] max-w-4xl bg-teal-600 p-4 rounded-lg"
    >
      <div className="flex flex-col justify-between items-center gap-5 bg-white h-full w-full p-10 rounded-xl">
        <SelectGroup
          options={vacationsMap.map((el) => {
            const val = el.replace("_", " ");
            return val.slice(0, 1).toUpperCase() + val.slice(1, val.length);
          })}
          onChange={(value) =>
            setVacationType(value.toLowerCase().replace(" ", "_"))
          }
        />

        <SecondaryInput
          name="note"
          text="Whats your reason?"
          type="text"
          onChange={(e) => setReason(e)}
        />
        <SecondaryButton bgColor={"bg-zinc-800"} onClick={requestVacation}>
          dodaj
        </SecondaryButton>
      </div>
    </div>
  );
}
