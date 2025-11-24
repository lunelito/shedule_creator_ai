"use server";

import { z } from "zod";

const employeesSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  user_id: z.number().int(),
  role: z.string().min(1),
  position: z.string().min(1),
  employee_code: z.string().min(1),
  organization_id: z.number().int(),
  default_hourly_rate: z.number().nonnegative(),
  contract_type: z.string().min(1),
  contracted_hours_per_week: z.number().nonnegative(),
  max_consecutive_days: z.number().int().positive(),
});

const employeesArraySchema = z.array(employeesSchema);

export type addEmployeesType = {
  success?: boolean;
  errors: {
    _form?: string[];
    users?: string[];
  };
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
          _form: ["Nieprawidłowe dane pracowników"],
        },
      };
    }

    if (!schedule_id) {
      return { errors: { _form: ["Brak przypisanego harmonogramu"] } };
    }

    const apiUrlEMP = new URL(
      "/api/employees",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();
    const apiUrlRoles = new URL(
      "/api/employee-roles",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    for (let i = 0; i < validation.data.length; i++) {
      const emp = validation.data[i];
      const role = emp.role;

      const resEmployee = await fetch(apiUrlEMP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: emp.user_id,
          employee_code: emp.employee_code,
          default_hourly_rate: Number(emp.default_hourly_rate),
          position: emp.position,
          timezone: "UTC",
          contract_type: emp.contract_type,
          organization_id: emp.organization_id,
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
            _form: [`Nie udało się dodać pracownika ${emp.name}: ${errorText}`],
          },
        };
      }

      const employeeData = await resEmployee.json();

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
        const errorText = await resRole.text();
        return {
          errors: {
            _form: [
              `Nie udało się przypisać roli dla ${emp.name}: ${errorText}`,
            ],
          },
        };
      }
    }

    return {
      success: true,
      errors: { _form: ["Pracownicy dodani poprawnie"] },
    };
  } catch (err: unknown) {
    return {
      errors: {
        _form: err instanceof Error ? [err.message] : ["Coś poszło nie tak"],
      },
    };
  }
}
