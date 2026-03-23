"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/store/taskStore";
import { scheduleAllReminders } from "@/lib/notifications/scheduler";
import { usePushSubscription } from "@/hooks/usePushSubscription";

/**
 * Background component that schedules notifications for upcoming task reminders
 * and registers push subscription for background notifications.
 */
export function ReminderScheduler() {
  const tasks = useTaskStore((s) => s.tasks);
  const { subscribe } = usePushSubscription();

  useEffect(() => {
    const upcomingTasks = tasks.filter((t) => t.reminder && !t.completed);
    scheduleAllReminders(upcomingTasks);
  }, [tasks]);

  // Auto-subscribe to push if permission already granted
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      subscribe();
    }
  }, [subscribe]);

  return null;
}
