"use server";

import { schedule_swap_requests } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type editScheduleSwapType = {
  success?: boolean;
  errors: {
    _form?: string[];
  };
  ScheduleSwap?: InferSelectModel<typeof schedule_swap_requests>;
};

export async function editScheduleSwap(
  formState: editScheduleSwapType,
  formData: FormData,
): Promise<editScheduleSwapType> {
  try {
    const formDataObj = Object.fromEntries(formData.entries());

    if (!formDataObj) {
      return {
        errors: { _form: ["No IDs provided."] },
      };
    }

    const apiUrl = new URL(
      `/api/schedule_swap_requests`,
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ).toString();

    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formDataObj }),
    });

    const text = await res.text();
    const responseData = text ? JSON.parse(text) : {};

    if (!res.ok) {
      return {
        errors: {
          _form: [
            responseData.error ||
              `Failed to ${formDataObj.decision} schedule swap. Please try again.`,
          ],
        },
      };
    }

    return {
      success: true,
      errors: { _form: [`schedule swap ${formDataObj.status} sucesfully`] },
      ScheduleSwap: responseData,
    };
  } catch (err: any) {
    return {
      errors: { _form: [err?.message || "An unexpected error occurred."] },
    };
  }
}
