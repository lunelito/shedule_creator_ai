"use server";

import { z } from "zod";

const scheduleSchema = z.object({
  name: z
    .string()
    .min(1, "Please provide a schedule name")
    .max(100, "Schedule name is too long"),

  organization_id: z
    .number()
    .int("Organization ID must be an integer")
    .positive("Invalid organization ID"),

  created_by: z
    .number()
    .int("Creator ID must be an integer")
    .nullable(),
});

export type addScheduleType = {
  success?: boolean;
  schedule_id?:string;
  errors: {
    name?: string[];
    organization_id?: string[];
    created_by?: string[];
    _form?: string[];
  };
};

export async function addSchedule(
  formState: addScheduleType,
  formData: FormData
): Promise<addScheduleType> {
  const result = scheduleSchema.safeParse({
    name: formData.get("name"),
    organization_id: parseInt(formData.get("organization_id") as string, 10),
    created_by: formData.get("created_by")
      ? parseInt(formData.get("created_by") as string, 10)
      : null,
  });

  if (!result.success) {
    const formatted = result.error.format();
    return {
      errors: {
        name: formatted.name?._errors ?? [],
        organization_id: formatted.organization_id?._errors ?? [],
        created_by: formatted.created_by?._errors ?? [],
      },
    };
  }

  try {
    const apiUrl = new URL(
      "/api/schedules",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: result.data.name,
        organization_id:result.data.organization_id,
        created_by:result.data.created_by
      }),
    });

    let responseData;

    try {
      responseData = await res.json();
    } catch {
      responseData = { error: await res.text() };
    }

    if (!res.ok) {
      return {
        errors: {
          _form: [responseData.error || "Failed to create schedule"],
        },
      };
    }

    return {
      success: true,
      schedule_id:responseData.id?.toString(),
      errors: { _form: ["Schedule added correctly"] },
    };

  } catch (err: unknown) {
    if (err instanceof Error) {
      return { errors: { _form: [err.message] } };
    } else {
      return { errors: { _form: ["Something went wrong"] } };
    }
  }
}
