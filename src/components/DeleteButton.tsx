"use client";

import { deleteApplication } from "@/lib/applications/actions";

export function DeleteButton({ id }: { id: number }) {
  return (
    <form
      action={deleteApplication.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Delete this application? This can't be undone.")) e.preventDefault();
      }}
    >
      <button type="submit" className="btn text-red-600 hover:bg-red-50">
        Delete
      </button>
    </form>
  );
}
