"use client";

import { useTaskStore } from "@/store/taskStore";

const statusConfig = {
  synced: { color: "bg-green-400", label: "" },
  syncing: { color: "bg-yellow-400 animate-pulse", label: "" },
  error: { color: "bg-red-400", label: "" },
  offline: { color: "bg-gray-500", label: "" },
};

export function SyncStatus() {
  const syncStatus = useTaskStore((s) => s.syncStatus);
  const useApi = useTaskStore((s) => s.useApi);

  // Don't show indicator if not using API
  if (!useApi) return null;

  const config = statusConfig[syncStatus];

  return (
    <div className="flex items-center gap-1.5" title={`Sync: ${syncStatus}`}>
      <div className={`h-2 w-2 rounded-full ${config.color}`} />
    </div>
  );
}
