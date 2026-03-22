export type Priority = "high" | "medium" | "low";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly";
  interval: number;
  days?: number[]; // 0=Sun, 1=Mon, etc.
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  date: string; // ISO date string YYYY-MM-DD
  time?: string; // HH:mm
  duration?: number; // minutes
  completed: boolean;
  tags: string[];
  recurrence?: RecurrenceRule;
  subtasks: Subtask[];
  reminder?: string; // ISO datetime string
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskInput = Pick<Task, "title" | "priority" | "date"> &
  Partial<Pick<Task, "description" | "time" | "duration" | "tags" | "recurrence" | "subtasks" | "reminder">>;
