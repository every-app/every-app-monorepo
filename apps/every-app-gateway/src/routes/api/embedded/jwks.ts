import { createServerFileRoute } from "@tanstack/react-start/server";
import { getPublicJWKS } from "../../../server/jwt-utils";

export const ServerRoute = createServerFileRoute("/api/embedded/jwks").methods({
  GET: async () => {
    const jwks = await getPublicJWKS();
    return new Response(JSON.stringify(jwks), {
      headers: { "Content-Type": "application/json" },
    });
  },
});
