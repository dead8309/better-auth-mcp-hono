import { createAuth } from "@/lib/auth";
import { AppBindings } from "@/types";
import { Hono } from "hono";
import { html } from "hono/html";

const authRouter = new Hono<AppBindings>();

authRouter.get("/sign-in", async (c) => {
  const auth = createAuth(c.env);
  const githubAuthUrlResult = await auth.api.signInSocial({
    body: {
      provider: "github",
    },
    request: c.req.raw,
  });
  const oauthUrl = githubAuthUrlResult.url;

  return c.html(html`
    <html lang="en">
      <body>
        <div>
          <h1>Sign In</h1>
          <p>Please sign in to authorize the application.</p>
          <a href="${oauthUrl}" class="button">Sign in with GitHub</a>
        </div>
      </body>
    </html>
  `);
});

authRouter.get("/sign-out", async (c) => {
  const auth = createAuth(c.env);
  await auth.api.signOut({
    headers: c.req.raw.headers,
  });
  return c.text("Signed Out");
});

export default authRouter;
