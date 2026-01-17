"use server";

export type deleteScheduleDayType = {
  success: boolean;
  errors: {
    _form?: string[];
  };
};

export async function deleteSingleScheduleDay(
  scheduleDayId: string | number
): Promise<deleteScheduleDayType> {
  try {
    if (!scheduleDayId) {
      return {
        success:false,
        errors: { _form: ["No schedule day id provided."] },
      };
    }

    const apiUrl = new URL(
      `/api/schedules_day/${scheduleDayId}`,
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    const res = await fetch(apiUrl, {
      method: "DELETE",
    });

    let responseData;

    try {
      responseData = await res.json();
    } catch {
      responseData = { error: await res.text() };
    }

    if (!res.ok) {
      return {
        success:false,
        errors: {
          _form: [
            responseData.error ||
              "Failed to delete schedule day. Server shit itself.",
          ],
        },
      };
    }

    return {
      success: true,
      errors: { _form: ["Schedule day deleted successfully."] },
    };
  } catch (err: any) {
    return {
      success:false,
      errors: {
        _form: [err?.message || "Unexpected error while deleting schedule day."],
      },
    };
  }
}
