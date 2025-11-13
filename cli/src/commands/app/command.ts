import { buildCommand, buildRouteMap } from "@stricli/core";

export const createCommand = buildCommand({
  loader: async () => import("./create"),
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [],
    },
  },
  docs: {
    brief: "Create a new app from the starter template",
    fullDescription: [
      "Copies the simple-todo starter template and configures your local development environment.",
      "",
      "The command will:",
      "  1. Prompt for app ID (kebab-case) and package manager",
      "  2. Copy the template to a new directory",
      "  3. Create Cloudflare D1 database and KV namespace",
      "  4. Configure wrangler.jsonc, package.json, and .env files",
      "  5. Install dependencies and run local migrations",
      "",
      "After creation, run 'npm run dev' to start developing.",
    ].join("\n"),
  },
});

export const deployCommand = buildCommand({
  loader: async () => {
    const { deploy } = await import("./deploy");
    return deploy;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [],
    },
    flags: {
      verbose: {
        kind: "boolean",
        brief: "Show detailed output during deployment",
        optional: true,
      },
    },
  },
  docs: {
    brief: "Deploy an app to Cloudflare",
    fullDescription: [
      "Deploys the current app to Cloudflare Workers from the current directory.",
      "The deployment process:",
      "  1. Reads wrangler.jsonc to determine required resources",
      "  2. Creates or links D1 databases and KV namespaces",
      "  3. Updates wrangler.jsonc with resource IDs",
      "  4. Installs dependencies if needed",
      "  5. Runs database migrations against production D1",
      "  6. Builds and deploys using wrangler deploy",
    ].join("\n"),
  },
});

export const appRoutes = buildRouteMap({
  routes: {
    create: createCommand,
    deploy: deployCommand,
  },
  docs: {
    brief: "App management commands",
  },
});
