import Form from "next/form";
import Link from "next/link";
import { SOURCES, STATUSES } from "@/lib/applications/constants";
import type { Filters } from "@/lib/applications/filters";

/** A GET form: submitting it just changes the URL (?status=…), which re-renders the list. */
export function FilterBar({ filters }: { filters: Filters }) {
  return (
    <Form action="/" className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <Select name="status" label="Status" options={STATUSES} value={filters.status} />
      <Select name="source" label="Source" options={SOURCES} value={filters.source} />
      <label className="text-xs text-slate-600">
        Applied from
        <input type="date" name="from" defaultValue={filters.from} className="field mt-1" />
      </label>
      <label className="text-xs text-slate-600">
        to
        <input type="date" name="to" defaultValue={filters.to} className="field mt-1" />
      </label>
      <input type="hidden" name="sort" value={filters.sort} />
      <input type="hidden" name="order" value={filters.order} />
      <button type="submit" className="btn-primary">
        Filter
      </button>
      <Link href="/" className="btn">
        Clear
      </Link>
    </Form>
  );
}

function Select({ name, label, options, value }: { name: string; label: string; options: readonly string[]; value?: string }) {
  return (
    <label className="text-xs text-slate-600">
      {label}
      <select name={name} defaultValue={value ?? ""} className="field mt-1">
        <option value="">All</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
