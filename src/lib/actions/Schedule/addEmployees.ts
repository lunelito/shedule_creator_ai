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
});

const employeesArraySchema = z.array(employeesSchema);

export type addEmployeesType = {
  success?: boolean;
  errors: {
    _form?: string[];
    users?: string[];
  };
  employees?: InferSelectModel<typeof employees>[];
};

export async function addEmployees(
  formState: addEmployeesType,
  formData: FormData
): Promise<addEmployeesType> {
  try {
    const employeesList = JSON.parse(formData.get("employees") as string);
    const schedule_id = formData.get("schedule_id")?.toString();

    // Walidacja pracowników
    const validation = employeesArraySchema.safeParse(employeesList);
    if (!validation.success) {
      const errors = Object.values(validation.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean) as string[];
      return {
        errors: {
          users: errors,
          _form: ["Incorrect employee data"],
        },
      };
    }

    if (!schedule_id) {
      return { errors: { _form: ["No schedule assigned"] } };
    }

    const apiUrlEMP = new URL(
      "/api/employees",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();
    const apiUrlRoles = new URL(
      "/api/employee-roles",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    const addedEmployees = [];

    for (let i = 0; i < validation.data.length; i++) {
      const emp = validation.data[i];
      const role = emp.role;

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
        }),
      });

      console.log(resEmployee, emp);

      if (!resEmployee.ok) {
        const errorText = await resEmployee.text();
        return {
          errors: {
            _form: [`Failed to add employee ${emp.name}`],
          },
        };
      }

      const employeeData = await resEmployee.json();

      addedEmployees.push(employeeData)

      const resRole = await fetch(apiUrlRoles, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeData.id,
          schedule_id,
          role,
        }),
      });

      if (!resRole.ok) {
        return {
          errors: {
            _form: [`Could not assign role to ${emp.name}`],
          },
        };
      }
    }

    return {
      success: true,
      errors: { _form: ["Employees added correctly"] },
      employees: addedEmployees,
    };
  } catch (err: unknown) {
    return {
      errors: {
        _form: err instanceof Error ? [err.message] : ["Something went wrong"],
      },
    };
  }
}
