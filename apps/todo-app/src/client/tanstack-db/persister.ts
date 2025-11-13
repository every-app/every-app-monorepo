import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export const persister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
  key: "todo-react-query-cache",
});
