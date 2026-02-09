"use server";

export type addScheduleType = {
  success?: boolean;
  errors: {
    _form?: string[];
  };
};

export async function addScheduleSwapRequest(
  formState: addScheduleType,
  formData: FormData,
) {
  try {
    const schiftSwapRaw = formData.get("schiftSwap");

    if (!schiftSwapRaw) {
      return {
        errors: { _form: ["No swap request provided."] },
      };
    }

    let schiftSwap;
    try {
      schiftSwap = JSON.parse(schiftSwapRaw as string);
    } catch {
      return {
        errors: {
          _form: ["Unable to send swap request. Please check the data format."],
        },
      };
    }

    const apiUrl = new URL(
      "/api/schedule_swap_requests",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ).toString();

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schiftSwap }),
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
              "Failed to send swap request. Please try again.",
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
