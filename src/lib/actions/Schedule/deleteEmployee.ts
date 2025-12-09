export const deleteEmployee = async (userId: number) => {
  try {
    const res = await fetch(`/api/employees/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
    }

    return true;
  } catch (err) {
    console.error("deleteEmployee error:", err);
    return false;
  }
};