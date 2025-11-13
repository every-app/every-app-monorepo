import { createAuth } from "./config";

// Export the auth instance for CLI schema generation
export const auth = createAuth();

// Export for runtime usage
export { createAuth };
