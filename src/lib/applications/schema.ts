import { z } from "zod";
import type { Application } from "@/generated/prisma/client";
import { parseDateInput, toDateInput } from "@/lib/dates";
import { SOURCES, STATUSES } from "./constants";

// Form fields arrive as strings; an empty field means "not set", stored as null.
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || null);

const optionalDate = optionalText
  .pipe(z.iso.date({ error: "Invalid date" }).nullable())
  .transform((v) => (v ? parseDateInput(v) : null));

// Only http(s): this value is rendered as a link, and "javascript:" URLs would run code.
const optionalUrl = optionalText.pipe(
  z.url({ protocol: /^https?$/, error: "Must be a valid http(s) URL" }).nullable(),
);

export const applicationSchema = z.object({
  company: z.string().trim().min(1, "Company is required"),
  roleTitle: z.string().trim().min(1, "Role title is required"),
  jobUrl: optionalUrl,
  location: optionalText,
  source: z.enum(SOURCES),
  status: z.enum(STATUSES),
  dateFound: optionalDate,
  dateApplied: optionalDate,
  followUpDate: optionalDate,
  resumeVersion: optionalText,
  contactName: optionalText,
  contactInfo: optionalText,
  jobDescription: optionalText,
  notes: optionalText,
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type FormValues = Partial<Record<keyof ApplicationInput, string>>;

/** The reverse of the schema: a saved row -> the string values a form shows. */
export function toFormValues(app: Application): FormValues {
  const fields = Object.keys(applicationSchema.shape) as (keyof ApplicationInput)[];
  return Object.fromEntries(
    fields.map((key) => {
      const value = app[key];
      return [key, value instanceof Date ? toDateInput(value) : (value ?? "")];
    }),
  );
}
