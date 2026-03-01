export const deleteEmployee = async (
  user_id: string | number,
  scheduleId: string
): Promise<boolean> => {
  try {
    const res = await fetch(`/api/employees/${user_id}/${scheduleId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("DELETE employee error:", errorData);
      return false;
    }

    return true;
  } catch (err) {
    console.error("deleteEmployee error:", err);
    return false;
  }
};
