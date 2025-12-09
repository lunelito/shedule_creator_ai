export const deleteSchedule = async (scheduleId: string | number) => {
  try {
    const res = await fetch(`/api/schedules/${scheduleId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
    }

    return true;
  } catch (err) {
    console.error("deleteSchedule error:", err);
    return false;
  }
};