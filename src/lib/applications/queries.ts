import "server-only";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { type Filters, toPrismaQuery } from "./filters";

export async function listApplications(filters: Filters) {
  await requireSession();
  return db.application.findMany(toPrismaQuery(filters));
}

export async function getApplication(id: number) {
  await requireSession();
  return db.application.findUnique({ where: { id } });
}
