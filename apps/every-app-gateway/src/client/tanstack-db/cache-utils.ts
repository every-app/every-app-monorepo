import { queryClient } from "./queryClient";
import { QUERY_CACHE_KEY } from "./persister";

/**
 * Clears all cached query data from memory and localStorage
 * Should be called on user sign out for security/privacy
 */
export function clearQueryCache() {
  // Clear in-memory cache
  queryClient.clear();

  // Clear localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(QUERY_CACHE_KEY);
    } catch (error) {
      console.error("Failed to clear localStorage cache:", error);
    }
  }
}
