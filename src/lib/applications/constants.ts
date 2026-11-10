export const STATUSES = [
  "Saved",
  "Applied",
  "Online Assessment",
  "Interviewing",
  "Offer",
  "Rejected",
  "Ghosted",
  "Withdrawn",
] as const;
export type Status = (typeof STATUSES)[number];

export const SOURCES = ["LinkedIn", "Indeed", "Wellfound", "Company site", "Referral", "Other"] as const;
export type Source = (typeof SOURCES)[number];

export const STATUS_STYLES: Record<Status, string> = {
  Saved: "bg-slate-100 text-slate-700",
  Applied: "bg-blue-100 text-blue-800",
  "Online Assessment": "bg-violet-100 text-violet-800",
  Interviewing: "bg-amber-100 text-amber-800",
  Offer: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Ghosted: "bg-zinc-200 text-zinc-600",
  Withdrawn: "bg-zinc-100 text-zinc-500",
};

export const SORT_KEYS = ["company", "roleTitle", "status", "dateFound", "dateApplied", "createdAt"] as const;
export type SortKey = (typeof SORT_KEYS)[number];
