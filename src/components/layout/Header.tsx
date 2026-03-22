"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import { SyncStatus } from "@/components/ui/SyncStatus";

export function Header() {
  const today = new Date();
  const formatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="glass safe-area-top relative z-20 flex items-center justify-between px-4 py-3">
      <div>
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">
          Planner
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">{formatted}</p>
      </div>
      <div className="flex items-center gap-3">
        <SyncStatus />
        <Link
          href="/settings"
        className="rounded-xl p-2 transition-colors hover:bg-[var(--bg-glass-heavy)]"
      >
        <Settings size={20} className="text-[var(--text-secondary)]" />
      </Link>
      </div>
    </header>
  );
}
