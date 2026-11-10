// Date-only values ("2026-11-10") are stored as UTC midnight. Always format them in UTC,
// otherwise a user west of Greenwich would see the previous day.

/** "2026-11-10" -> Date at UTC midnight. */
export function parseDateInput(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

/** Date -> "2026-11-10", the format <input type="date"> expects. */
export function toDateInput(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

/** Date -> "Nov 10, 2026" for display. */
export function formatDate(date: Date | null): string {
  return date
    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    : "—";
}
