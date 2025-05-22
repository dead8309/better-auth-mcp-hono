## 🪿 HONC Mcp Server

This is a project created with the `create-honc-app` template, extended to function as an MCP (Model Context Protocol) server with user authentication via GitHub, powered by `better-auth`.

Learn more about the HONC stack on the [website](https://honc.dev) or the main [repo](https://github.com/fiberplane/create-honc-app).
There is also an [Awesome HONC collection](https://github.com/fiberplane/awesome-honc) with further guides, use cases and examples.

## Access the remote MCP server from any MCP Client

If your MCP client has first class support for remote MCP servers, the client will provide a way to accept the server URL (`https://better-auth-mcp.cjjdxhdjd.workers.dev/sse`) directly within its interface.

If your client does not yet support remote MCP servers, you will need to set up its respective configuration file using [mcp-remote](https://www.npmjs.com/package/mcp-remote) to specify which servers your client can access.

Replace the content with the following configuration:

```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://better-auth-mcp.cjjdxhdjd.workers.dev/sse"
      ]
    }
  }
}
```

### Getting started

Make sure you have Neon set up and configured with your database. Create a .dev.vars file with the `DATABASE_URL` key and value (see: `.dev.vars.example`).

### Project structure

```#
.
├── README.md
├── src
│   ├── db                  # Database schema and setup
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── env-runtime.ts
│   ├── env.ts
│   ├── index.ts
│   ├── lib
│   │   └── auth.ts         # better-auth configuration
│   ├── mcp.ts              # MCP Durable Object (MyAgent) & MCP routes
│   ├── middleware          # Hono middlewares
│   │   └── with-session.ts
│   ├── routes              # HTTP routes
│   │   ├── auth.tsx
│   │   └── user.ts
│   └── types.ts
└── wrangler.jsonc
```

### Prerequisites

- Node.js and npm/yarn/pnpm
- A Neon database (or other PostgreSQL provider)
- A GitHub OAuth Application for user authentication.
- Cloudflare account and wrangler CLI installed and configured.

### Environment Variables

Create a .dev.vars file for local development (copied from .env.example) and set up secrets/variables in your Cloudflare Worker environment for deployment.

- `DATABASE_URL`: Connection string for your PostgreSQL database.
- `GITHUB_CLIENT_ID`: Client ID from your GitHub OAuth App.
- `GITHUB_CLIENT_SECRET`: Client Secret from your GitHub OAuth App.
- `BETTER_AUTH_SECRET`: A strong, unique secret string (e.g., openssl rand -hex 32) used by better-auth for signing cookies and tokens. This is critical for security.
- `BETTER_AUTH_URL`: The root URL of your deployed Cloudflare Worker (e.g., https://your-app-name.your-workers-subdomain.workers.dev). This is used by better-auth to construct redirect URIs.

### Getting Started

1. Clone the repository.
2. Install dependencies:

```sh
npm install
```

3.  Set up environment variables: Create a .dev.vars file from .env.example and fill in your details.

4.  Database Migrations

    - Generate better-auth migrations:

    ```
    pnpm dlx @better-auth/cli@latest generate
    ```

    - Apply migrations:

    ```
    pnpm db:migrate
    ```

5.  Run the development server:

```
pnpm dev
```

### Deploying

Set your secrets (and any other secrets you need) with wrangler:

```sh
npx wrangler secret put MY_INSANE
```

Deploy with wrangler:

```sh
pnpm  deploy
```
