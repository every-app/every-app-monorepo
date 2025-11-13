// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import fs from "fs";
import path from "path";

function getLocalD1DB() {
  const basePath = path.resolve(".wrangler");
  const dbFile = fs
    .readdirSync(basePath, { encoding: "utf-8", recursive: true })
    .find((f) => f.endsWith(".sqlite"));

  if (!dbFile) {
    throw new Error(
      `Wrangler local sqlite file not found. Please run \`npx wrangler d1 execute YOUR_DATABASE_NAME --local --command "SELECT 1;"\` to initialize your local db with wrangler.`,
    );
  }

  const url = path.resolve(basePath, dbFile);
  return url;
}

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  ...(process.env.MIGRATE_REMOTE === "true"
    ? {
        driver: "d1-http",
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
          databaseId: process.env.CLOUDFLARE_DATABASE_ID,
          token: process.env.CLOUDFLARE_API_TOKEN,
        },
      }
    : {
        dbCredentials: {
          url: getLocalD1DB(),
        },
      }),
});
