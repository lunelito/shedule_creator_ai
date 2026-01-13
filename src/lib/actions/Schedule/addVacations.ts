"use server";
import { time_off_requests } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import z from "zod";

const vacationSchema = z.object({
  date: z.string().min(1, "no date added"),
  isScheduled: z.boolean(),
  type: z.enum(time_off_requests.type.enumValues),
});

const vacationArrayScheam = z.array(vacationSchema);

type addVacationsType = {
  success?: boolean;
  errors: {
    _form?: string[];
    vacations?: string[];
  };
  vacations?: any;
};

export async function addVacations(
  formState: addVacationsType,
  formData: FormData
): Promise<addVacationsType> {
  try {
    const vacations = JSON.parse(formData.get("vacations") as string);
    const scheduleId = formData.get("schedule_id");
    const employeeId = formData.get("employee_id");
    const reason = formData.get("reason");

    const validation = vacationArrayScheam.safeParse(vacations);

    if (!validation.success) {
      const errors = Object.values(validation.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean) as string[];
      return {
        success: false,
        errors: {
          vacations: errors,
          _form: ["Incorrect vacations data"],
        },
      };
    }

    if (employeeId === null) {
      return {
        success: false,
        errors: {
          _form: ["No employee Id"],
        },
      };
    }

    if (reason === null) {
      return {
        success: false,
        errors: {
          _form: ["No reason aded."],
        },
      };
    }

    if (scheduleId === null) {
      return {
        success: false,
        errors: {
          _form: ["No schedule ID"],
        },
      };
    }

    const apiUrl = new URL(
      "/api/time-off-request",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    const adedVacations = [];

    for (let i = 0; i < vacations.length; i++) {
      const vacation = vacations[i];

      console.log(vacation.date);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId,
          approved_by: null,
          schedule_id: scheduleId,
          type: vacation.type,
          approved_at: null,
          status: "waiting",
          date: vacation.date,
          hours_scheduled: vacation.scheduledHours,
          is_scheduled: vacation.isScheduled,
          reason: reason,
        }),
      });

      if (!res.ok) {
        return {
          errors: {
            _form: [`Failed to add vacation on ${vacation.date}`],
          },
        };
      }

      const data = await res.json();

      adedVacations.push(data);
    }

    console.log(scheduleId, vacations, employeeId);
    return {
      success: true,
      errors: { _form: ["Vacations added correctly"] },
      vacations: adedVacations,
    };
  } catch (err) {
    return {
      errors: {
        _form: err instanceof Error ? [err.message] : ["Something went wrong"],
      },
    };
  }
}
