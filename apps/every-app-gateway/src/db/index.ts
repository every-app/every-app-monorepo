import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import invariant from "tiny-invariant";
import { getBindings } from "@/server/bindings";

/**
 * Lazy-initialized database instance.
 *
 * IMPORTANT: The db is lazy-loaded (initialized on first access) rather than at module load time.
 * This prevents issues in development mode where client-side code might import modules that
 * transitively import this db module. In dev mode, Vite doesn't split client/server code as
 * aggressively as in production builds, so module-level initialization would cause getBindings()
 * to be called on the client side, resulting in errors.
 *
 * By lazy-loading, we ensure the database is only initialized when actually used (server-side),
 * not when the module is imported.
 */
let _db: DrizzleD1Database<typeof schema> | null = null;

export const db = new Proxy({} as DrizzleD1Database<typeof schema>, {
  get(_, prop) {
    // Initialize db on first access
    if (!_db) {
      const env = getBindings();
      invariant(
        env,
        "The database should only be accessed server-side. If you're seeing this error, " +
          "it means db is being accessed on the client. Check your imports and ensure db " +
          "is only used in server functions, middleware, or server-side routes.",
      );
      _db = drizzle(env.DB, { schema });
    }
    return Reflect.get(_db, prop);
  },
});

export { schema };
