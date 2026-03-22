"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { ReminderScheduler } from "@/components/ui/ReminderScheduler";

const QuickAddModal = dynamic(
  () => import("@/components/tasks/QuickAddModal").then((m) => m.QuickAddModal),
  { ssr: false }
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // Global keyboard shortcut: N to open Quick Add
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "n" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setQuickAddOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openQuickAdd = useCallback(() => setQuickAddOpen(true), []);
  const closeQuickAdd = useCallback(() => setQuickAddOpen(false), []);

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-primary)]">
      <div className="bg-mesh" aria-hidden="true" />
      <Header />
      <main className="app-container relative z-10 flex-1 overflow-y-auto px-4 pb-24 pt-4">
        {children}
      </main>
      <BottomNav onQuickAdd={openQuickAdd} />
      <QuickAddModal
        open={quickAddOpen}
        onClose={closeQuickAdd}
        defaultDate={new Date()}
      />
      <ReminderScheduler />
    </div>
  );
}
