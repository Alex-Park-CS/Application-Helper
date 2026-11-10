"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SOURCES, STATUSES } from "@/lib/applications/constants";
import type { FormState } from "@/lib/applications/actions";
import type { FormValues } from "@/lib/applications/schema";

const NEW_DEFAULTS: FormValues = { status: "Saved", source: "LinkedIn" };

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initialValues?: FormValues;
  submitLabel: string;
};

/** Shared by the "new" and "edit" pages; the page decides which action it calls. */
export function ApplicationForm({ action, initialValues = NEW_DEFAULTS, submitLabel }: Props) {
  const [state, formAction, isPending] = useActionState(action, {});
  const values = state.values ?? initialValues;
  const errors = state.errors ?? {};

  // Small helper so every field gets the same name / default value / error wiring.
  const field = (name: keyof FormValues) => ({ id: name, name, defaultValue: values[name] ?? "" });
  const error = (name: keyof FormValues) =>
    errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name][0]}</p>;

  return (
    <form action={formAction} className="space-y-6 rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Label text="Company *" htmlFor="company">
          <input {...field("company")} required className="field" />
          {error("company")}
        </Label>
        <Label text="Role title *" htmlFor="roleTitle">
          <input {...field("roleTitle")} required className="field" />
          {error("roleTitle")}
        </Label>
        <Label text="Job URL" htmlFor="jobUrl">
          <input {...field("jobUrl")} type="url" placeholder="https://" className="field" />
          {error("jobUrl")}
        </Label>
        <Label text="Location / remote" htmlFor="location">
          <input {...field("location")} placeholder="Remote, Toronto (hybrid)…" className="field" />
        </Label>
        <Label text="Status" htmlFor="status">
          <select {...field("status")} className="field">
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Label>
        <Label text="Source" htmlFor="source">
          <select {...field("source")} className="field">
            {SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Label text="Date found" htmlFor="dateFound">
          <input {...field("dateFound")} type="date" className="field" />
        </Label>
        <Label text="Date applied" htmlFor="dateApplied">
          <input {...field("dateApplied")} type="date" className="field" />
        </Label>
        <Label text="Follow-up date" htmlFor="followUpDate">
          <input {...field("followUpDate")} type="date" className="field" />
        </Label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Label text="Resume version" htmlFor="resumeVersion">
          <input {...field("resumeVersion")} placeholder="e.g. v2-backend" className="field" />
        </Label>
        <Label text="Contact name" htmlFor="contactName">
          <input {...field("contactName")} className="field" />
        </Label>
        <Label text="Contact info" htmlFor="contactInfo">
          <input {...field("contactInfo")} placeholder="Email, LinkedIn…" className="field" />
        </Label>
      </div>

      <Label text="Job description" htmlFor="jobDescription">
        <textarea {...field("jobDescription")} rows={6} placeholder="Paste the posting here" className="field" />
      </Label>
      <Label text="Notes" htmlFor="notes">
        <textarea {...field("notes")} rows={3} className="field" />
      </Label>

      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? "Saving…" : submitLabel}
        </button>
        <Link href="/" className="btn">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Label({ text, htmlFor, children }: { text: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
        {text}
      </label>
      {children}
    </div>
  );
}
