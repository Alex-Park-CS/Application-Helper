"use client";

import { useOptimistic, useTransition } from "react";
import { STATUS_STYLES, STATUSES, type Status } from "@/lib/applications/constants";
import { updateStatus } from "@/lib/applications/actions";

/** Inline status dropdown for the list. Shows the new value instantly (optimistic UI) while the server saves. */
export function StatusSelect({ id, status }: { id: number; status: Status }) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);
  const [, startTransition] = useTransition();

  return (
    <select
      aria-label="Status"
      value={optimisticStatus}
      onChange={(e) => {
        const next = e.target.value as Status;
        startTransition(async () => {
          setOptimisticStatus(next);
          await updateStatus(id, next);
        });
      }}
      className={`cursor-pointer rounded-full border-0 py-1 pr-7 pl-3 text-xs font-medium ${STATUS_STYLES[optimisticStatus]}`}
    >
      {STATUSES.map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>
  );
}
