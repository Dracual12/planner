"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/store/taskStore";
import { scheduleAllReminders } from "@/lib/notifications/scheduler";

/**
 * Background component that schedules notifications for upcoming task reminders.
 * Runs on mount and whenever tasks change.
 */
export function ReminderScheduler() {
  const tasks = useTaskStore((s) => s.tasks);

  useEffect(() => {
    const upcomingTasks = tasks.filter(
      (t) => t.reminder && !t.completed
    );
    scheduleAllReminders(upcomingTasks);
  }, [tasks]);

  return null;
}
