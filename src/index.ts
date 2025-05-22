import { createFiberplane, createOpenAPISpec } from "@fiberplane/hono";
import { createAuth } from "@/lib/auth";
import { AppBindings } from "@/types";
import { Hono } from "hono";
import { parseEnv } from "@/env";
import { env } from "cloudflare:workers";
import { cors } from "hono/cors";
import withSession from "@/middleware/with-session";
import { configDotenv } from "dotenv";
import userRouter from "@/routes/user";
import authRouter from "@/routes/auth";
import mcpRouter, { MyAgent } from "@/mcp";
configDotenv();

const app = new Hono<AppBindings>();

app.use((c, next) => {
  c.env = parseEnv(Object.assign({}, process.env, env));
  return next();
});

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// NOTE: hook session middleware
app.use("*", withSession);

// NOTE: better-auth MCP plugin `after` hook returns a JSON object
// { "redirect": true, "url": "..." }
// instead of performing an HTTP 302 redirect
app.use("/api/auth/*", async (c, next) => {
  await next();
  if (c.res.status === 200 && c.req.path.startsWith("/api/auth/callback/")) {
    const clonedResponse = c.res.clone();
    const jsonData = (await clonedResponse.json()) as {
      redirect: boolean;
      url: string;
    };

    if (jsonData && jsonData.redirect === true) {
      c.res = c.redirect(jsonData.url, 302);
    }
  }
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

app.get("/openapi.json", (c) => {
  return c.json(
    createOpenAPISpec(app, {
      info: {
        title: "MCP + better-auth",
        version: "1.0.0",
      },
    })
  );
});

app.use(
  "/fp/*",
  createFiberplane({
    app,
    openapi: { url: "/openapi.json" },
  })
);

app.route("/", mcpRouter);
app.route("/", authRouter);
app.route("/user", userRouter);

export { MyAgent };
export default app;
