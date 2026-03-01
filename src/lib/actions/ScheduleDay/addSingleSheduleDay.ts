"use server";

import { z } from "zod";

export type addScheduleType = {
  success?: boolean;
  errors: {
    _form?: string[];
  };
  schedulesDays?: any;
};

export async function addSingleSheduleDay(
  formState: addScheduleType,
  formData: FormData
): Promise<addScheduleType> {
  try {
    const shiftsRaw = formData.get("shifts");

    if (!shiftsRaw) {
      return {
        errors: { _form: ["No shifts provided."] },
      };
    }

    let shifts;
    try {
      shifts = JSON.parse(shiftsRaw as string);
    } catch {
      return {
        errors: {
          _form: ["Unable to parse shifts. Please check the data format."],
        },
      };
    }

    const apiUrl = new URL(
      "/api/schedules_day",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shifts }),
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
            responseData.error ||
              "Failed to create schedule. Please try again.",
          ],
        },
      };
    }

    return {
      success: true,
      errors: { _form: ["Schedule added successfully."] },
      schedulesDays: responseData, // to jest faktyczny JSON
    };
  } catch (err: any) {
    return {
      errors: { _form: [err?.message || "An unexpected error occurred."] },
    };
  }
}
