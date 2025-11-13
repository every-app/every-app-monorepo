// Custom environment variable type definitions
// These extend the auto-generated Env interface from worker-configuration.d.ts

declare module "cloudflare:workers" {
  interface Env {
    // Better Auth secrets
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;

    // Core app configuration
    CORE_APP_URL: string;

    // JWT keys
    JWT_PRIVATE_KEY: string;
    JWT_PUBLIC_KEY: string;
  }
}
