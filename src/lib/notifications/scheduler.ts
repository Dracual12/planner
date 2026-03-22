"use client";

import type { Task } from "@/types/task";

const scheduledTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function scheduleReminder(task: Task) {
  // Clear existing timer for this task
  cancelReminder(task.id);

  if (!task.reminder || task.completed) return;

  const reminderTime = new Date(task.reminder).getTime();
  const now = Date.now();
  const delay = reminderTime - now;

  // Don't schedule if in the past or more than 24h away
  if (delay <= 0 || delay > 24 * 60 * 60 * 1000) return;

  const timer = setTimeout(() => {
    fireNotification(task);
    scheduledTimers.delete(task.id);
  }, delay);

  scheduledTimers.set(task.id, timer);
}

export function cancelReminder(taskId: string) {
  const timer = scheduledTimers.get(taskId);
  if (timer) {
    clearTimeout(timer);
    scheduledTimers.delete(taskId);
  }
}

export function scheduleAllReminders(tasks: Task[]) {
  // Clear all existing timers
  scheduledTimers.forEach((timer) => clearTimeout(timer));
  scheduledTimers.clear();

  // Schedule upcoming reminders
  tasks.forEach(scheduleReminder);
}

function fireNotification(task: Task) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const priorityEmoji =
    task.priority === "high" ? "🔴" : task.priority === "medium" ? "🟡" : "🟢";

  const notification = new Notification(`${priorityEmoji} ${task.title}`, {
    body: task.time ? `Scheduled for ${task.time}` : "Reminder",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    tag: task.id, // Prevents duplicate notifications
    requireInteraction: true,
  });

  // Click notification → focus app
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

// Compute reminder datetime from task date/time and offset
export function computeReminderTime(
  date: string,
  time: string | undefined,
  offset: "at-time" | "15min" | "1h" | "1day"
): string | undefined {
  if (!time && offset !== "1day") return undefined;

  let base: Date;
  if (time) {
    base = new Date(`${date}T${time}:00`);
  } else {
    base = new Date(`${date}T09:00:00`); // Default to 9am if no time
  }

  switch (offset) {
    case "at-time":
      return base.toISOString();
    case "15min":
      return new Date(base.getTime() - 15 * 60 * 1000).toISOString();
    case "1h":
      return new Date(base.getTime() - 60 * 60 * 1000).toISOString();
    case "1day":
      return new Date(base.getTime() - 24 * 60 * 60 * 1000).toISOString();
    default:
      return undefined;
  }
}
