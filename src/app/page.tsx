import { Suspense } from "react";
import { ApplicationTable } from "@/components/ApplicationTable";
import { FilterBar } from "@/components/FilterBar";
import { parseFilters, type SearchParams, toQueryString } from "@/lib/applications/filters";
import { listApplications } from "@/lib/applications/queries";

// The heading is static and sent instantly; the list streams in once the DB query finishes.
export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Applications</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <ApplicationList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ApplicationList({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filters = parseFilters(await searchParams);
  const applications = await listApplications(filters);
  return (
    <>
      {/* key: remount the form when the URL changes so its inputs show the new filters */}
      <FilterBar key={toQueryString(filters)} filters={filters} />
      <ApplicationTable applications={applications} filters={filters} />
    </>
  );
}
