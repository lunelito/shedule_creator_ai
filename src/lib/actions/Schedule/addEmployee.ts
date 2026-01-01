"use server";

import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

const employeesSchema = z.object({
  email: z
    .string()
    .min(5, "Email is too short")
    .max(100, "Email is too long")
    .email("Invalid email address"),
  name: z.string().min(1, "Name cannot be empty").max(50, "Name is too long"),
  role: z.string().min(1, "Role cannot be empty").max(50, "Role is too long"),
  user_id: z
    .number()
    .int("User ID must be an integer")
    .positive("User ID must be positive"),
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
  accept_to_schedule: z.string().min(1, "accept to shedule must have value"),
});

export type addEmployeesType = {
  success?: boolean;
  errors: {
    _form?: string[];
    users?: string[];
  };
  employee?: InferSelectModel<typeof employees>;
};

export async function addEmployee(
  formState: addEmployeesType,
  formData: FormData
): Promise<addEmployeesType> {
  try {
    const employee = JSON.parse(formData.get("employee") as string);
    const schedule_id = formData.get("schedule_id")?.toString();

    const validation = employeesSchema.safeParse({
      ...employee,
    });

    if (!validation.success) {
      const errors = Object.values(validation.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean) as string[];

      return {
        errors: {
          users: errors,
          _form: ["Zjebane dane employee"],
        },
      };
    }

    if (!schedule_id) {
      return { errors: { _form: ["Brak schedule_id debilu"] } };
    }

    const emp = validation.data;

    const apiUrlEMP = new URL(
      "/api/employees",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    const resEmployee = await fetch(apiUrlEMP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: emp.user_id,
        name: emp.name,
        email: emp.email,
        employee_code: emp.employee_code,
        default_hourly_rate: Number(emp.default_hourly_rate),
        position: emp.position,
        timezone: "UTC",
        contract_type: emp.contract_type,
        role: emp.role,
        contracted_hours_per_week: Number(emp.contracted_hours_per_week),
        max_consecutive_days: Number(emp.max_consecutive_days),
        assigned_to_schedule: Number(schedule_id),
        accept_to_schedule: emp.accept_to_schedule,
      }),
    });

    if (!resEmployee.ok) {
      return { errors: { _form: ["Nie dodano employee, chujnia"] } };
    }


    return {
      success: true,
      errors: {},
      employee: JSON.parse(employee),
    };
  } catch (e) {
    console.log(e);
    return {
      errors: {
        _form: ["Serwer się zesrał"],
      },
    };
  }
}
