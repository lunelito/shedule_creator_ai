import PrimaryButton from "@/components/UI/PrimaryButton";
import SecondaryButton from "@/components/UI/SecondaryButton";
import { employees } from "@/db/schema";
import { addEmployeeNote } from "@/lib/actions/Schedule/EmployeeNote/addEmployeeNote";
import { deleteEmployeeNote } from "@/lib/actions/Schedule/EmployeeNote/deleteEmployeeNote";
import { InferSelectModel } from "drizzle-orm";
import React, { SetStateAction, useEffect, useState } from "react";

type EmployeeNoteType = {
  fetchedNote: string | null;
  employee_id: number;
  setEmployeesFetched: React.Dispatch<
    SetStateAction<InferSelectModel<typeof employees>[]>
  >;
  setError: React.Dispatch<SetStateAction<string>>;
};

export default function EmployeeNote({
  fetchedNote,
  employee_id,
  setEmployeesFetched,
  setError,
}: EmployeeNoteType) {
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    setNote(fetchedNote !== null ? fetchedNote : "No note added");
  }, [fetchedNote]);

  const addNote = async () => {
    if (note === "No note added") {
      setError("Add note");
      return 0;
    }
    const formData = new FormData();
    formData.append("note", note);
    formData.append("employee_id", employee_id.toString());
    try {
      const result = await addEmployeeNote({ errors: {} }, formData);
      console.log(result);
      if (result.success) {
        setError("Note aded");
        setEmployeesFetched((prev) =>
          prev.map((el) => (el.id === employee_id ? { ...el, note: note } : el))
        );
      }
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => setError(""), 2000);
  };

  const updateNote = async () => {
    if (note === "No note added") {
      setError("Add note");
      return 0;
    }
    const formData = new FormData();
    formData.append("note", note);
    formData.append("employee_id", employee_id.toString());
    try {
      const result = await addEmployeeNote({ errors: {} }, formData);
      console.log(result);
      if (result.success) {
        setError("Note updated");
        setEmployeesFetched((prev) =>
          prev.map((el) => (el.id === employee_id ? { ...el, note: note } : el))
        );
      }
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => setError(""), 2000);
  };

  const deleteNote = async () => {
    try {
      const result = await deleteEmployeeNote(employee_id);
      console.log(result);
      if (result.success) {
        setError("Note deleted");
        setEmployeesFetched((prev) =>
          prev.map((el) => (el.id === employee_id ? { ...el, note: null } : el))
        );
      }
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => setError(""), 2000);
  };

  return (
    <div className="h-full">
      <textarea
        className="w-full h-3/4 p-3 focus:outline-none focus:ring-none text-center text-xl"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="h-1/4 flex justify-center items-center gap-4">
        {fetchedNote ? (
          <SecondaryButton onClick={updateNote}>update</SecondaryButton>
        ) : (
          <SecondaryButton onClick={addNote}>add</SecondaryButton>
        )}
        {fetchedNote && (
          <SecondaryButton onClick={deleteNote}>delete</SecondaryButton>
        )}
      </div>
    </div>
  );
}
