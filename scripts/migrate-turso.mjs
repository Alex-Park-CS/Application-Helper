// Applies prisma/migrations/*/migration.sql to the hosted Turso database.
// Prisma Migrate can't connect to Turso yet, so production uses this small runner;
// locally, `prisma migrate deploy` manages the SQLite file as usual.
// Each migration runs in a transaction and is recorded, so re-running is safe.
import { readdirSync, readFileSync } from "node:fs";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
if (!url?.startsWith("libsql://")) {
  console.log("DATABASE_URL is not a Turso URL; skipping (local files use `prisma migrate deploy`).");
  process.exit(0);
}

const db = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
await db.execute("CREATE TABLE IF NOT EXISTS _applied_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)");
const applied = new Set((await db.execute("SELECT name FROM _applied_migrations")).rows.map((r) => r.name));

const pending = readdirSync("prisma/migrations", { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !applied.has(entry.name))
  .map((entry) => entry.name)
  .sort(); // folder names start with a timestamp, so this is chronological

for (const name of pending) {
  const tx = await db.transaction("write");
  try {
    await tx.executeMultiple(readFileSync(`prisma/migrations/${name}/migration.sql`, "utf8"));
    await tx.execute({ sql: "INSERT INTO _applied_migrations VALUES (?, ?)", args: [name, new Date().toISOString()] });
    await tx.commit();
    console.log(`Applied ${name}`);
  } catch (error) {
    await tx.rollback();
    throw error;
  }
}
console.log(pending.length ? `${pending.length} migration(s) applied.` : "Database is up to date.");
