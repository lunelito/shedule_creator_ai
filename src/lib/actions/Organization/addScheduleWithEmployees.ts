"use server";

import { z } from "zod";

const employeesSchema = z.object({
  email: z
    .string()
    .min(5, "Email is too short")
    .max(100, "Email is too long")
    .email("Invalid email address"),
  name: z.string().min(1, "Name cannot be empty").max(50, "Name is too long"),
  user_id: z
    .number()
    .int("User ID must be an integer")
    .positive("User ID must be positive"),
  role: z.string().min(1, "Role cannot be empty").max(50, "Role is too long"),
  position: z
    .string()
    .min(1, "Position cannot be empty")
    .max(50, "Position is too long"),
  employee_code: z
    .string()
    .min(1, "Employee code cannot be empty")
    .max(20, "Employee code is too long"),
  default_hourly_rate: z
    .number()
    .nonnegative("Default hourly rate cannot be negative"),
  contract_type: z
    .string()
    .min(1, "Contract type cannot be empty")
    .max(50, "Contract type is too long"),
  contracted_hours_per_week: z
    .number()
    .nonnegative("Contracted hours per week cannot be negative"),
  max_consecutive_days: z
    .number()
    .int("Max consecutive days must be an integer")
    .positive("Max consecutive days must be positive"),
  accept_to_schedule: z.string().min(1, "accept to schedule must have value"),
  image: z.string().min(1, "image must have value"),
});

const scheduleSchema = z.object({
  name: z
    .string()
    .min(1, "Please provide a schedule name")
    .max(100, "Schedule name is too long"),
  organization_id: z
    .number()
    .int("Organization ID must be an integer")
    .positive("Invalid organization ID"),
  created_by: z.number().int("Creator ID must be an integer").nullable(),
});

type AddScheduleWithEmployeesType = {
  success?: boolean;
  schedule_id?: string;
  errors: {
    name?: string[];
    organization_id?: string[];
    created_by?: string[];
    users?: string[];
    _form?: string[];
  };
};

export async function addScheduleWithEmployees(
  formState: AddScheduleWithEmployeesType,
  formData: FormData
): Promise<AddScheduleWithEmployeesType> {
  // 1. Parse employees JSON
  let parsedEmployees: unknown;
  try {
    parsedEmployees = JSON.parse(formData.get("employees") as string);
  } catch {
    return { errors: { users: ["Invalid employees data"] } };
  }

  // 2. Walidacja grafiku
  const scheduleResult = scheduleSchema.safeParse({
    name: formData.get("name"),
    organization_id: parseInt(formData.get("organization_id") as string, 10),
    created_by: formData.get("created_by")
      ? parseInt(formData.get("created_by") as string, 10)
      : null,
  });

  if (!scheduleResult.success) {
    const formatted = scheduleResult.error.format();
    return {
      errors: {
        name: formatted.name?._errors ?? [],
        organization_id: formatted.organization_id?._errors ?? [],
        created_by: formatted.created_by?._errors ?? [],
      },
    };
  }

  // 3. Walidacja pracowników
  const employeesResult = z.array(employeesSchema).safeParse(parsedEmployees);

  if (!employeesResult.success) {
    const errors = Object.values(employeesResult.error.flatten().fieldErrors)
      .flat()
      .filter(Boolean) as string[];
    return {
      errors: {
        users: errors,
        _form: ["Incorrect employee data"],
      },
    };
  }

  // 4. Fetch do API
  try {
    const apiUrl = new URL(
      "/api/createScheduleWithEmployees",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: scheduleResult.data.name,
        organization_id: scheduleResult.data.organization_id,
        created_by: scheduleResult.data.created_by,
        employees: employeesResult.data,
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
      schedule_id: responseData.schedule_id?.toString(),
      errors: { _form: ["Schedule with employees added correctly"] },
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
     return { errors: { _form: [err.message] } };
    } else {
      return { errors: { _form: ["Something went wrong"] } };
    }
  }
}