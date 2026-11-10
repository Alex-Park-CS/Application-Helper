import "server-only";
import { db } from "@/lib/db";
import { type Filters, toPrismaQuery } from "./filters";

export function listApplications(filters: Filters) {
  return db.application.findMany(toPrismaQuery(filters));
}

export function getApplication(id: number) {
  return db.application.findUnique({ where: { id } });
}
