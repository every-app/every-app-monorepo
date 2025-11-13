import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  // This client should only be used in client-side code which will always have a window.
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
});

export { authClient };
