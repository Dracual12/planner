"use client";

import useSWR from "swr";
import { fetchTasksByDate } from "@/lib/api/tasks";
import type { Task } from "@/types/task";

export function useTasks(date: string) {
  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    date ? `tasks-${date}` : null,
    () => fetchTasksByDate(date),
    {
      revalidateOnFocus: true,
      fallbackData: [],
    }
  );

  return {
    tasks: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
