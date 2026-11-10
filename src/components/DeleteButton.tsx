"use client";

import { deleteApplication } from "@/lib/applications/actions";

type Props = {
  id: number;
  company: string;
  goToList?: boolean; // true on the edit page, where the application disappears
  compact?: boolean; // small text button for table rows
};

export function DeleteButton({ id, company, goToList = false, compact = false }: Props) {
  return (
    <form
      action={deleteApplication.bind(null, id, { goToList })}
      onSubmit={(e) => {
        if (!confirm(`Delete the ${company} application? This can't be undone.`)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        aria-label={`Delete ${company} application`}
        className={compact ? "text-xs text-slate-400 hover:text-red-600" : "btn text-red-600 hover:bg-red-50"}
      >
        Delete
      </button>
    </form>
  );
}
