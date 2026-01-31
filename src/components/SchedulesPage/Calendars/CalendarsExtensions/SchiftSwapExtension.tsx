import PrimaryButton from "@/components/UI/PrimaryButton";
import { ShiftSwapState } from "../RowCalendarWithSwap";
import { SetStateAction, useState } from "react";
import { addScheduleSwapRequest } from "@/lib/actions/ScheduleDay/addScheduleSwapRequest";

type ShiftSwapExtensionType = {
  calendarHeight: number;
  shiftSwap: ShiftSwapState;
  setEmployeePick: React.Dispatch<SetStateAction<number>>;
  employeePick: number;
  removeSelectedShift: (day: string) => void;
  setError: React.Dispatch<SetStateAction<string>>;
};

type ShiftData = {
  name: string;
  start: string | number;
  end: string | number;
  scheduledHours: string | number;
  date: string | null;
};

export default function ShiftSwapExtension({
  calendarHeight,
  shiftSwap,
  setEmployeePick,
  employeePick,
  removeSelectedShift,
  setError,
}: ShiftSwapExtensionType) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const getShiftData = (
    shiftPart: typeof shiftSwap.offeredShift | typeof shiftSwap.desiredShift,
  ): ShiftData => {
    const { employee, shift, date } = shiftPart;

    if (!shift) {
      return {
        name: employee?.name || "-",
        start: "-",
        end: "-",
        scheduledHours: "-",
        date: date || "-",
      };
    }

    if (shift === "time_off") {
      return {
        name: employee?.name || "-",
        start: "Time Off",
        end: "-",
        scheduledHours: "-",
        date: date || "-",
      };
    }

    return {
      name: employee?.name || "-",
      start: new Date(shift.start_at).getHours(),
      end: new Date(shift.end_at).getHours(),
      scheduledHours: shift.scheduled_hours,
      date: date || "-",
    };
  };

  const sendScheduleSwapRequest = async () => {
    if (
      !shiftSwap.offeredShift.shift ||
      !shiftSwap.desiredShift.shift ||
      !shiftSwap.offeredShift.employee ||
      !shiftSwap.desiredShift.employee
    ) {
      setError("Fill all fields you dumb fuck");
      setTimeout(() => setError(""), 2000);
      return;
    }

    setIsPending(true);

    const formData = new FormData();

    formData.append("schiftSwap", JSON.stringify(shiftSwap));

    try {
      const result = await addScheduleSwapRequest({ errors: {} }, formData);

      if (result.success) {
        setError("Request sent!");
        setTimeout(() => setError(""), 2000);
      } else {
        // const scheduleRequestErrors = result.errors.vacations?.[0]
        //   ? result.errors.vacations[0] + " in schedule request fields"
        //   : null;
        const formError =
          result.errors._form?.[0] ?? "Error while inserting schedule request";

        // setError(scheduleRequestErrors ?? formError);
        setError(formError);
      }
      setIsPending(false);
    } catch (err) {
      console.error(err);
      setError("Server error");
      setIsPending(false);
    }
  };

  const offeredShiftData = getShiftData(shiftSwap.offeredShift);
  const desiredShiftData = getShiftData(shiftSwap.desiredShift);

  const hasOfferedShift = offeredShiftData.name !== "-";
  const hasDesiredShift = desiredShiftData.name !== "-";

  return (
    <div
      style={{ height: calendarHeight }}
      className="w-[20vw] max-w-4xl bg-teal-600 p-4 rounded-lg"
    >
      <div className="flex flex-col justify-between items-center text-zinc-800 gap-5 bg-white h-full w-full p-10 rounded-xl">
        <div
          className={`h-2/5 w-full flex flex-col justify-center p-4 items-center rounded-xl text-2xl cursor-pointer transition-colors ${
            employeePick === 0
              ? "bg-teal-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setEmployeePick(0)}
          onDoubleClick={() =>
            offeredShiftData.date
              ? removeSelectedShift(offeredShiftData.date)
              : null
          }
          role="button"
        >
          {hasOfferedShift ? (
            <div className="flex flex-col gap-2 justify-center items-center text-center">
              <p className="font-bold">{offeredShiftData.name}</p>
              <p className="text-lg">
                {offeredShiftData.start}{" "}
                {offeredShiftData.end !== "-" && `- ${offeredShiftData.end}`}
              </p>
              {offeredShiftData.scheduledHours !== "-" && (
                <p className="text-lg">
                  {offeredShiftData.scheduledHours} hours
                </p>
              )}
              <p className="text-lg">{offeredShiftData.date}</p>
            </div>
          ) : (
            <p className="font-bold text-center">
              Select shift you want to{" "}
              <span
                className={`${employeePick === 0 ? "text-white" : "text-teal-600"}`}
              >
                offer
              </span>{" "}
              to someone.
            </p>
          )}
        </div>

        <div
          className={`h-2/5 w-full flex flex-col justify-center p-4 items-center rounded-xl text-2xl cursor-pointer transition-colors ${
            employeePick === 1
              ? "bg-teal-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setEmployeePick(1)}
          onDoubleClick={() =>
            desiredShiftData.date
              ? removeSelectedShift(desiredShiftData.date)
              : null
          }
          role="button"
        >
          {hasDesiredShift ? (
            <div className="flex flex-col gap-2 justify-center items-center text-center">
              <p className="font-bold">{desiredShiftData.name}</p>
              <p className="text-lg">
                {desiredShiftData.start}{" "}
                {desiredShiftData.end !== "-" && `- ${desiredShiftData.end}`}
              </p>
              {desiredShiftData.scheduledHours !== "-" && (
                <p className="text-lg">
                  {desiredShiftData.scheduledHours} hours
                </p>
              )}
              <p className="text-lg">{desiredShiftData.date}</p>
            </div>
          ) : (
            <p className="font-bold text-center">
              Select shift you want to{" "}
              <span
                className={`${employeePick === 1 ? "text-white" : "text-teal-600"}`}
              >
                receive
              </span>{" "}
              from someone.
            </p>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center items-center h-1/5">
          <PrimaryButton
            onClick={sendScheduleSwapRequest}
            isPending={isPending}
          >
            Swap Shifts
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
