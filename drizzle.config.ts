import { defineConfig } from "drizzle-kit";
import env from "@/env-runtime"

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
