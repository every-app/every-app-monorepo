import { z } from "zod";

// Message schemas for postMessage communication
export const SessionTokenRequestSchema = z.object({
  type: z.literal("SESSION_TOKEN_REQUEST"),
  requestId: z.string(),
  appId: z.string().optional(),
});

export const RouteChangeMessageSchema = z.object({
  type: z.literal("ROUTE_CHANGE"),
  route: z.string(),
  direction: z.enum(["parent-to-child", "child-to-parent"]),
  appId: z.string().optional(),
});

const SessionTokenResponseMessageSchema = z.object({
  type: z.literal("SESSION_TOKEN_RESPONSE"),
  requestId: z.string(),
  token: z.string().optional(),
  expiresAt: z.string().optional(),
  audience: z.string().optional(),
  appId: z.string().optional(),
  error: z.string().optional(),
});

export type SessionTokenResponseMessage = z.infer<
  typeof SessionTokenResponseMessageSchema
>;
