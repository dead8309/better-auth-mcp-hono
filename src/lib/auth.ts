import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Environment } from "@/env";
import { mcp, openAPI } from "better-auth/plugins";
import * as schema from "@/db/schema";
import { createDb } from "@/db";

export const createAuth = (env: Environment) => {
  const db = createDb(env);
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema,
    }),
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
    plugins: [
      openAPI(),
      mcp({
        loginPage: "/sign-in",
      }),
    ],
  });
};

// NOTE: To generate better-auth schema using pnpx @better-auth/cli generate,
// uncomment the following code and comment out the above code

// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
// import { configDotenv } from "dotenv";
// configDotenv();
// const sql = neon(process.env.DATABASE_URL!);
// const db = drizzle(sql);
// export const auth = betterAuth({
//   baseURL: process.env.BETTER_AUTH_URL,
//   secret: process.env.BETTER_AUTH_SECRET,
//   database: drizzleAdapter(db, {
//     provider: "pg",
//     usePlural: true,
//     schema,
//   }),
//   socialProviders: {
//     github: {
//       clientId: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     },
//   },
//   plugins: [
//     openAPI(),
//     mcp({
//       loginPage: "/sign-in",
//     }),
//   ],
// });
