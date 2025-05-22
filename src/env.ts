import { z } from "zod";

const EnvSchema = z
  .object({
    NODE_ENV: z.string().default("development"),
    DATABASE_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string().url(),
  })
  .passthrough();

export type Environment = z.infer<typeof EnvSchema> & Env;

export function parseEnv(data: any) {
  const { data: env, error } = EnvSchema.safeParse(data);

  if (error) {
    const errorMessage = `error: invalid env:\n${Object.entries(
      error.flatten().fieldErrors
    )
      .map(([key, errors]) => `${key}: ${errors?.join(", ")}`)
      .join("\n")}`;
    throw new Error(errorMessage);
  }

  return env as Environment;
}
