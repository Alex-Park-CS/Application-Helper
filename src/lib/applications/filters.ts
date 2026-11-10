import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { parseDateInput } from "@/lib/dates";
import { SORT_KEYS, SOURCES, STATUSES } from "./constants";

export type SearchParams = Record<string, string | string[] | undefined>;

// Anything invalid in the URL falls back to "no filter" / the default sort instead of erroring.
const filtersSchema = z.object({
  status: z.enum(STATUSES).optional().catch(undefined),
  source: z.enum(SOURCES).optional().catch(undefined),
  from: z.iso.date().optional().catch(undefined),
  to: z.iso.date().optional().catch(undefined),
  sort: z.enum(SORT_KEYS).catch("createdAt"),
  order: z.enum(["asc", "desc"]).catch("desc"),
});

export type Filters = z.infer<typeof filtersSchema>;

export function parseFilters(params: SearchParams): Filters {
  return filtersSchema.parse(params);
}

/** Filters -> Prisma findMany args. `undefined` means "don't filter on this field". */
export function toPrismaQuery({ status, source, from, to, sort, order }: Filters) {
  return {
    where: {
      status,
      source,
      dateApplied:
        from || to
          ? { gte: from ? parseDateInput(from) : undefined, lte: to ? parseDateInput(to) : undefined }
          : undefined,
    },
    orderBy: { [sort]: order },
  } satisfies Prisma.ApplicationFindManyArgs;
}

/** Builds a "?status=…&sort=…" link that keeps current filters, with some overridden. */
export function toQueryString(filters: Filters, overrides: Partial<Filters> = {}): string {
  const entries = Object.entries({ ...filters, ...overrides }).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );
  return `?${new URLSearchParams(entries)}`;
}
