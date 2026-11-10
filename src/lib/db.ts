import "server-only";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

// libSQL speaks both local SQLite files (file:./prisma/dev.db) and hosted Turso
// databases (libsql://…), so dev and production share one code path.
function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
  return new PrismaClient({ adapter: new PrismaLibSql({ url, authToken: process.env.DATABASE_AUTH_TOKEN }) });
}

// Reuse one client across hot reloads in dev, instead of opening a new connection per edit.
const globalForDb = globalThis as unknown as { db?: PrismaClient };
export const db = globalForDb.db ?? createClient();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;
