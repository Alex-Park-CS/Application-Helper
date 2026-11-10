import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Next.js loads .env.local automatically; the Prisma CLI doesn't, so load it here.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL },
});
