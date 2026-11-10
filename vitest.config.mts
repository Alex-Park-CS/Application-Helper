import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true }, // understand the "@/..." import alias
  test: { include: ["src/**/*.test.ts"] },
});
