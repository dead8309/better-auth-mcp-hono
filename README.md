[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/dead8309-better-auth-mcp-hono-badge.png)](https://mseep.ai/app/dead8309-better-auth-mcp-hono)

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

Make sure you have Neon set up and configured with your database.

### Prerequisites

- Node.js and npm/yarn/pnpm
- A Neon database (or other PostgreSQL provider)
- A GitHub OAuth Application for user authentication.
- Cloudflare account and wrangler CLI installed and configured.

### Environment Variables

Create a `.dev.vars` and `.env`(for better-auth schema generation) file for
local development (copied from `.env.example`) and set up secrets/variables in
your Cloudflare Worker environment for deployment.

### Getting Started

1. Clone the repository.

```sh
git clone https://github.com/dead8309/better-auth-mcp-hono/
```

2. Install dependencies:

```sh
pnpm install
```

3.  Set up environment variables: Create a `.dev.vars` and `.env` files from `.env.example`.

4.  Run the development server:

```
pnpm dev
```

### Deploying

Set your secrets (and any other secrets you need) with wrangler:

```sh
pnpm wrangler secret bulk .dev.vars
```

Deploy with wrangler:

```sh
pnpm  deploy
```
