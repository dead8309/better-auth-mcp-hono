import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  OAuthAccessToken,
  oAuthDiscoveryMetadata,
  withMcpAuth,
} from "better-auth/plugins";
import { Octokit } from "@octokit/rest";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { accounts, users } from "@/db/schema";
import { Hono } from "hono";
import { AppBindings } from "./types";

type Props = {
  session: OAuthAccessToken;
};

type State = null;

export class MyAgent extends McpAgent<Env, State, Props> {
  server = new McpServer({
    name: "Mcp Server",
    version: "1.0.0",
  });

  async init() {
    this.server.tool(
      "user-details",
      "Returns information about the authenticated user stored in database.",
      {},
      async () => {
        const userId = this.props.session.userId;
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ...user }),
            },
          ],
        };
      }
    );

    this.server.tool(
      "github-details",
      "Returns github account information for the authenticated user",
      {},
      async () => {
        const account = await db.query.accounts.findFirst({
          where: and(
            eq(accounts.userId, this.props.session.userId),
            eq(accounts.providerId, "github")
          ),
        });
        const octokit = new Octokit({ auth: account?.accessToken });
        const user = await octokit.users.getAuthenticated();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ...user.data }),
            },
          ],
        };
      }
    );
  }
}

const router = new Hono<AppBindings>();

router.get("/.well-known/oauth-authorization-server", async (c) => {
  const handler = oAuthDiscoveryMetadata(auth);
  return handler(c.req.raw);
});

router.all("/sse/*", (c) => {
  const agent = (req: Request, session: OAuthAccessToken) => {
    (c.executionCtx as any).props = {
      session,
    };

    const fetch = MyAgent.mount("/sse").fetch;
    return fetch(req, c.env, c.executionCtx as globalThis.ExecutionContext);
  };

  const handler = withMcpAuth(auth, agent);
  return handler(c.req.raw);
});

export default router;
