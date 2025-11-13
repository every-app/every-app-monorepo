import { createIsomorphicFn } from "@tanstack/react-start";

let cachedEnv: Env | null = null;

// This gets called once at startup when running locally - server only
const initDevEnv = createIsomorphicFn().server(async () => {
  const { getPlatformProxy } = await import("wrangler");
  const proxy = await getPlatformProxy();
  cachedEnv = proxy.env as unknown as Env;
});

// Only run in dev mode on the server
if (import.meta.env.DEV) {
  await initDevEnv();
}

/**
 * Get Cloudflare bindings (D1, KV, etc.)
 * Uses createIsomorphicFn().server() to ensure it never runs in the browser
 */
export const getBindings = createIsomorphicFn().server((): Env => {
  if (import.meta.env.DEV) {
    if (!cachedEnv) {
      throw new Error(
        "Dev bindings not initialized yet. Call initDevEnv() first.",
      );
    }
    return cachedEnv;
  }

  return process.env as unknown as Env;
});
