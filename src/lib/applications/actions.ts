"use server";

import { z } from "zod";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { STATUSES } from "./constants";
import { type ApplicationInput, applicationSchema, type FormValues } from "./schema";

// Server Actions: called from forms/buttons in the browser, but run only on the server.
// Every input is re-validated here because anyone can POST to an action directly.

export type FormState = {
  errors?: Partial<Record<keyof ApplicationInput, string[]>>;
  values?: FormValues; // echoed back so the form keeps what the user typed
};

/** Create (id = null) or update. Used with useActionState, hence the (prevState, formData) shape. */
export async function saveApplication(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  const values = Object.fromEntries(formData) as FormValues;
  const parsed = applicationSchema.safeParse(values);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors, values };

  if (id === null) await db.application.create({ data: parsed.data });
  else await db.application.update({ where: { id }, data: parsed.data });
  redirect("/");
}

export async function updateStatus(id: number, status: string) {
  await db.application.update({ where: { id }, data: { status: z.enum(STATUSES).parse(status) } });
  refresh(); // re-render the current page with fresh data
}

export async function deleteApplication(id: number) {
  await db.application.delete({ where: { id } });
  redirect("/");
}
