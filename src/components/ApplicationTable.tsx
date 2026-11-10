import Link from "next/link";
import type { Application } from "@/generated/prisma/client";
import type { SortKey, Status } from "@/lib/applications/constants";
import { type Filters, toQueryString } from "@/lib/applications/filters";
import { formatDate } from "@/lib/dates";
import { DeleteButton } from "./DeleteButton";
import { StatusSelect } from "./StatusSelect";

type Column = { key: SortKey; label: string; className?: string };

// Less important columns are hidden on phones to avoid sideways scrolling.
const COLUMNS: Column[] = [
  { key: "company", label: "Company" },
  { key: "roleTitle", label: "Role" },
  { key: "status", label: "Status" },
  { key: "dateApplied", label: "Applied", className: "hidden sm:table-cell" },
  { key: "dateFound", label: "Found", className: "hidden md:table-cell" },
];

export function ApplicationTable({ applications, filters }: { applications: Application[]; filters: Filters }) {
  if (applications.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No applications found.{" "}
        <Link href="/applications/new" className="text-blue-600 hover:underline">
          Add one
        </Link>
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} className={`px-3 py-2 font-medium ${col.className ?? ""}`}>
                <SortLink column={col} filters={filters} />
              </th>
            ))}
            <th className="hidden px-3 py-2 font-medium lg:table-cell">Source</th>
            <th className="px-3 py-2">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50">
              <td className="px-3 py-2 font-medium">
                <Link href={`/applications/${app.id}`} className="hover:underline">
                  {app.company}
                </Link>
                {app.jobUrl && (
                  <a href={app.jobUrl} target="_blank" rel="noreferrer" title="Open posting" className="ml-1 text-slate-400">
                    ↗
                  </a>
                )}
              </td>
              <td className="px-3 py-2">{app.roleTitle}</td>
              <td className="px-3 py-2">
                <StatusSelect id={app.id} status={app.status as Status} />
              </td>
              <td className="hidden px-3 py-2 whitespace-nowrap sm:table-cell">{formatDate(app.dateApplied)}</td>
              <td className="hidden px-3 py-2 whitespace-nowrap md:table-cell">{formatDate(app.dateFound)}</td>
              <td className="hidden px-3 py-2 lg:table-cell">{app.source}</td>
              <td className="px-3 py-2 text-right">
                <DeleteButton id={app.id} company={app.company} compact />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Clicking the active column flips the order; clicking another column sorts by it ascending. */
function SortLink({ column, filters }: { column: Column; filters: Filters }) {
  const active = filters.sort === column.key;
  const order = active && filters.order === "asc" ? "desc" : "asc";
  return (
    <Link href={toQueryString(filters, { sort: column.key, order })} className="hover:text-slate-900">
      {column.label} {active && (filters.order === "asc" ? "▲" : "▼")}
    </Link>
  );
}
