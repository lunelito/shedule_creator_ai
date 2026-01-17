"use server";

import { time_off_requests } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type editVacationType = {
  success?: boolean;
  errors: {
    _form?: string[];
  };
  vacation?: InferSelectModel<typeof time_off_requests>;
};

export async function editVacation(
  formState: editVacationType,
  formData: FormData
): Promise<editVacationType> {
  try {
    const vacationId = formData.get("vacationId");
    const scheduleId = formData.get("scheduleId");
    const reasonReject = formData.get("reasonReject");
    const decision = formData.get("decision");
    const userId = formData.get("userId");

    if (!scheduleId || !vacationId) {
      return {
        errors: { _form: ["No IDs provided."] },
      };
    }

    const apiUrl = new URL(
      `/api/time-off-request/${scheduleId}/${vacationId}`,
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vacationId, decision, reasonReject,userId }),
    });

    const text = await res.text();
    const responseData = text ? JSON.parse(text) : {};

    if (!res.ok) {
      return {
        errors: {
          _form: [
            responseData.error ||
              `Failed to ${decision} vacation. Please try again.`,
          ],
        },
      };
    }

    return {
      success: true,
      errors: { _form: [`Vacation ${decision} sucesfully`] },
      vacation: responseData.employee,
    };
  } catch (err: any) {
    return {
      errors: { _form: [err?.message || "An unexpected error occurred."] },
    };
  }
}
