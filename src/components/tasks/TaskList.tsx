"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { useTaskStore } from "@/store/taskStore";

const SortableTaskList = dynamic(
  () => import("./SortableTaskList").then((m) => m.SortableTaskList),
  { ssr: false }
);

interface TaskListProps {
  selectedDate: Date;
}

export function TaskList({ selectedDate }: TaskListProps) {
  const getTasksByDate = useTaskStore((s) => s.getTasksByDate);
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const tasks = useMemo(() => getTasksByDate(dateKey), [getTasksByDate, dateKey]);

  if (tasks.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          No tasks for this day. Tap + to add one.
        </p>
      </div>
    );
  }

  return <SortableTaskList tasks={tasks} dateKey={dateKey} />;
}
