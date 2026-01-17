"use server";

import { z } from "zod";

const AddEmployeeNoteSchema = z.object({
  note: z.string().min(1, "Note cannot be empty").max(1000, "Note is too long"),
  employee_id: z.coerce
    .number()
    .int("Employee ID must be an integer")
    .positive("Employee ID must be positive"),
});

export type AddEmployeeNoteState = {
  success?: boolean;
  errors?: {
    _form?: string[];
    note?: string[];
  };
};

export async function addEmployeeNote(
  prevState: AddEmployeeNoteState,
  formData: FormData
): Promise<AddEmployeeNoteState> {
  try {
    const validation = AddEmployeeNoteSchema.safeParse({
      note: formData.get("note"),
      employee_id: formData.get("employee_id"),
    });

    if (!validation.success) {
      return {
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const { note, employee_id } = validation.data;

    const apiUrl = new URL(
      `/api/employeeNote/${employee_id}`,
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note, employee_id }),
    });

    if (!res.ok) {
      return {
        errors: {
          _form: ["Failed to add note"],
        },
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    return {
      errors: {
        _form: [
          err instanceof Error ? err.message : "server error",
        ],
      },
    };
  }
}
