import { createFileRoute } from "@tanstack/react-router";
/**
 * Child catch-all route that matches sub-paths like /apps/todo-app/history
 *
 * IMPORTANT: This route must exist as a SEPARATE file from $appId.tsx!
 *
 * When this route changes, TanStack Router only remounts THIS component,
 * while the parent layout ($appId.tsx) stays mounted, preserving the iframe.
 *
 * DO NOT merge this with the parent route or delete this file - doing so
 * will cause the iframe to hard-reload on every navigation.
 *
 * See $appId.tsx for more details on this routing pattern.
 */
export const Route = createFileRoute("/apps/$appId/$")({
  component: () => null, // Parent layout handles all rendering
});
