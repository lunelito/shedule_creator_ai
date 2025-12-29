"use server";

import { employees } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export type addScheduleType = {
  success?: boolean;
  errors: {
    _form?: string[];
  };
  employee?: InferSelectModel<typeof employees>;
};

export async function editEmployeeInvite(
  formState: addScheduleType,
  formData: FormData
): Promise<addScheduleType> {
  try {
    const inviteRaw = formData.get("invite");
    const decision = formData.get("decision");

    if (!inviteRaw) {
      return {
        errors: { _form: ["No employee data provided."] },
      };
    }

    let invite;
    try {
      invite = JSON.parse(inviteRaw as string);
    } catch {
      return {
        errors: {
          _form: ["Unable to parse shifts. Please check the data format."],
        },
      };
    }

    const apiUrl = new URL(
      "/api/inbox",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invite, decision }),
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
          _form: [
            responseData.error || "Failed to edit schedule. Please try again.",
          ],
        },
      };
    }

    return {
      success: true,
      errors: { _form: ["Schedule edited successfully."] },
      employee: responseData.employee,
    };
  } catch (err: any) {
    return {
      errors: { _form: [err?.message || "An unexpected error occurred."] },
    };
  }
}
