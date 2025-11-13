import { useLiveQuery } from "@tanstack/react-db";
import { useSession } from "./useSession";
import { userAppsCollection } from "../tanstack-db";

/**
 * Hook to fetch and resolve app configuration from user apps or marketplace
 * @param appId - The ID of the app to resolve
 * @returns Object containing app config and loading/error states
 */
export function useAppConfig(appId: string) {
  const session = useSession();
  const {
    data: userApps,
    isLoading,
    isError,
  } = useLiveQuery(
    (q) =>
      session.data?.user ? q.from({ userApp: userAppsCollection }) : undefined,
    [session.data?.user],
  );

  const app = userApps?.find((a) => a.appId === appId);

  return { app, isLoading, isError };
}
