import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";

export function createDb(env: Env) {
  const sql = neon(env.DATABASE_URL);
  return drizzle(sql, {
    schema,
    casing: "snake_case",
  });
}
