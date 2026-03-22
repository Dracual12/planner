import type { Task } from "@/types/task";

const BASE = "/api/tasks";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `API error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Map DB Priority enum to frontend lowercase
function mapTask(dbTask: Record<string, unknown>): Task {
  return {
    ...dbTask,
    priority: (dbTask.priority as string).toLowerCase(),
    subtasks: (dbTask.subtasks as Record<string, unknown>[])?.map((s) => ({
      id: s.id as string,
      title: s.title as string,
      completed: s.completed as boolean,
    })) ?? [],
    tags: (dbTask.tags as string[]) ?? [],
  } as unknown as Task;
}

export async function fetchTasksByDate(date: string): Promise<Task[]> {
  const tasks = await apiFetch<Record<string, unknown>[]>(
    `${BASE}?date=${date}`
  );
  return tasks.map(mapTask);
}

export async function createTask(
  data: Record<string, unknown>
): Promise<Task> {
  // Map frontend priority to DB enum
  const payload = {
    ...data,
    priority:
      typeof data.priority === "string"
        ? data.priority.toUpperCase()
        : "MEDIUM",
  };
  const task = await apiFetch<Record<string, unknown>>(BASE, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapTask(task);
}

export async function updateTask(
  id: string,
  data: Record<string, unknown>
): Promise<Task> {
  const payload = { ...data };
  if (typeof payload.priority === "string") {
    payload.priority = payload.priority.toUpperCase();
  }
  const task = await apiFetch<Record<string, unknown>>(`${BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return mapTask(task);
}

export async function deleteTask(id: string): Promise<void> {
  await apiFetch(`${BASE}/${id}`, { method: "DELETE" });
}

export async function toggleComplete(id: string, completed: boolean): Promise<Task> {
  return updateTask(id, { completed });
}

export async function reorderTasks(orderedIds: string[]): Promise<void> {
  await apiFetch(`${BASE}/reorder`, {
    method: "PUT",
    body: JSON.stringify({ orderedIds }),
  });
}

export async function addSubtask(
  taskId: string,
  title: string
): Promise<Record<string, unknown>> {
  return apiFetch(`${BASE}/${taskId}/subtasks`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export async function toggleSubtask(
  taskId: string,
  subId: string,
  completed: boolean
): Promise<Record<string, unknown>> {
  return apiFetch(`${BASE}/${taskId}/subtasks?subId=${subId}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
}

export async function deleteSubtask(
  taskId: string,
  subId: string
): Promise<void> {
  await apiFetch(`${BASE}/${taskId}/subtasks?subId=${subId}`, {
    method: "DELETE",
  });
}
