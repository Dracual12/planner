"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, CreateTaskInput, Subtask, RecurrenceRule } from "@/types/task";
import * as api from "@/lib/api/tasks";

function generateId() {
  return crypto.randomUUID();
}

/** Check if a recurring task should appear on the given date */
function matchesRecurrence(
  taskDate: string,
  targetDate: string,
  rule: RecurrenceRule
): boolean {
  const start = new Date(taskDate + "T00:00:00");
  const target = new Date(targetDate + "T00:00:00");

  // Only future or same-day occurrences
  if (target < start) return false;

  const diffMs = target.getTime() - start.getTime();
  const diffDays = Math.round(diffMs / 86400000);

  if (rule.frequency === "daily") {
    return diffDays % rule.interval === 0;
  }

  if (rule.frequency === "weekly") {
    const diffWeeks = diffDays / 7;
    if (diffWeeks % rule.interval !== 0 && !rule.days) return false;
    if (rule.days && rule.days.length > 0) {
      // Check if target's day-of-week is in the specified days
      const dow = target.getDay();
      if (!rule.days.includes(dow)) return false;
      // Check the week interval
      const weeksDiff = Math.floor(diffDays / 7);
      return weeksDiff % rule.interval === 0;
    }
    // No specific days: repeat on the same weekday
    return diffDays % (7 * rule.interval) === 0;
  }

  if (rule.frequency === "monthly") {
    const monthsDiff =
      (target.getFullYear() - start.getFullYear()) * 12 +
      (target.getMonth() - start.getMonth());
    if (monthsDiff < 0 || monthsDiff % rule.interval !== 0) return false;
    return target.getDate() === start.getDate();
  }

  return false;
}

type SyncStatus = "synced" | "syncing" | "error" | "offline";

interface TaskStore {
  tasks: Task[];
  syncStatus: SyncStatus;
  useApi: boolean;

  // Config
  setUseApi: (enabled: boolean) => void;

  // Selectors
  getTasksByDate: (date: string) => Task[];

  // Actions (optimistic — update local first, then sync to API)
  addTask: (input: CreateTaskInput) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  reorderTasks: (date: string, orderedIds: string[]) => void;

  // Subtask actions
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Sync
  loadFromApi: (date: string) => Promise<void>;
  setSyncStatus: (status: SyncStatus) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      syncStatus: "offline" as SyncStatus,
      useApi: false,

      setUseApi: (enabled) => set({ useApi: enabled }),

      setSyncStatus: (status) => set({ syncStatus: status }),

      getTasksByDate: (date: string) => {
        const allTasks = get().tasks;
        const result: Task[] = [];
        const seenIds = new Set<string>();

        for (const t of allTasks) {
          // Exact date match
          if (t.date === date) {
            if (!seenIds.has(t.id)) {
              result.push(t);
              seenIds.add(t.id);
            }
            continue;
          }

          // Recurring task: check if it should appear on this date
          if (
            t.recurrence &&
            !t.completed &&
            matchesRecurrence(t.date, date, t.recurrence)
          ) {
            if (!seenIds.has(t.id)) {
              // Create a virtual instance with the target date
              result.push({ ...t, date, completed: false });
              seenIds.add(t.id);
            }
          }
        }

        return result.sort((a, b) => {
          if (a.time && b.time) return a.time.localeCompare(b.time);
          if (a.time) return -1;
          if (b.time) return 1;
          return 0;
        });
      },

      loadFromApi: async (date: string) => {
        if (!get().useApi) return;
        try {
          set({ syncStatus: "syncing" });
          const tasks = await api.fetchTasksByDate(date);
          set((state) => {
            // Merge: replace tasks for this date, keep others
            const otherTasks = state.tasks.filter((t) => t.date !== date);
            return { tasks: [...otherTasks, ...tasks], syncStatus: "synced" };
          });
        } catch {
          set({ syncStatus: "error" });
        }
      },

      addTask: (input) => {
        const now = new Date().toISOString();
        const task: Task = {
          id: generateId(),
          title: input.title,
          description: input.description,
          priority: input.priority,
          date: input.date,
          time: input.time,
          duration: input.duration,
          completed: false,
          tags: input.tags ?? [],
          recurrence: input.recurrence,
          subtasks: input.subtasks ?? [],
          createdAt: now,
          updatedAt: now,
        };

        // Optimistic update
        set((state) => ({ tasks: [...state.tasks, task] }));

        // Sync to API in background
        if (get().useApi) {
          set({ syncStatus: "syncing" });
          api
            .createTask({
              title: task.title,
              description: task.description,
              priority: task.priority,
              date: task.date,
              time: task.time,
              duration: task.duration,
              tags: task.tags,
              subtasks: task.subtasks.map((s) => ({ title: s.title })),
            })
            .then((serverTask) => {
              // Replace optimistic task with server task (has real ID)
              set((state) => ({
                tasks: state.tasks.map((t) =>
                  t.id === task.id ? serverTask : t
                ),
                syncStatus: "synced",
              }));
            })
            .catch(() => {
              set({ syncStatus: "error" });
            });
        }

        return task;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        }));

        if (get().useApi) {
          set({ syncStatus: "syncing" });
          api.updateTask(id, updates as Record<string, unknown>).then(
            () => set({ syncStatus: "synced" }),
            () => set({ syncStatus: "error" })
          );
        }
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));

        if (get().useApi) {
          set({ syncStatus: "syncing" });
          api.deleteTask(id).then(
            () => set({ syncStatus: "synced" }),
            () => set({ syncStatus: "error" })
          );
        }
      },

      toggleComplete: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const newCompleted = !task.completed;
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, completed: newCompleted, updatedAt: new Date().toISOString() }
              : t
          ),
        }));

        if (get().useApi) {
          set({ syncStatus: "syncing" });
          api.toggleComplete(id, newCompleted).then(
            () => set({ syncStatus: "synced" }),
            () => set({ syncStatus: "error" })
          );
        }
      },

      reorderTasks: (date, orderedIds) => {
        set((state) => {
          const otherTasks = state.tasks.filter((t) => t.date !== date);
          const dateTasks = orderedIds
            .map((id) => state.tasks.find((t) => t.id === id))
            .filter(Boolean) as Task[];
          return { tasks: [...otherTasks, ...dateTasks] };
        });

        if (get().useApi) {
          set({ syncStatus: "syncing" });
          api.reorderTasks(orderedIds).then(
            () => set({ syncStatus: "synced" }),
            () => set({ syncStatus: "error" })
          );
        }
      },

      addSubtask: (taskId, title) => {
        const subtask: Subtask = { id: generateId(), title, completed: false };
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: [...t.subtasks, subtask], updatedAt: new Date().toISOString() }
              : t
          ),
        }));

        if (get().useApi) {
          api.addSubtask(taskId, title).catch(() => {
            set({ syncStatus: "error" });
          });
        }
      },

      toggleSubtask: (taskId, subtaskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        const sub = task?.subtasks.find((s) => s.id === subtaskId);
        if (!sub) return;

        const newCompleted = !sub.completed;
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? { ...s, completed: newCompleted } : s
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));

        if (get().useApi) {
          api.toggleSubtask(taskId, subtaskId, newCompleted).catch(() => {
            set({ syncStatus: "error" });
          });
        }
      },

      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));

        if (get().useApi) {
          api.deleteSubtask(taskId, subtaskId).catch(() => {
            set({ syncStatus: "error" });
          });
        }
      },
    }),
    {
      name: "planner-tasks",
      partialize: (state) => ({
        tasks: state.tasks,
        useApi: state.useApi,
      }),
    }
  )
);
