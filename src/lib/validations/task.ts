import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().max(2000).optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be HH:mm")
    .optional()
    .nullable(),
  duration: z.number().int().min(1).max(1440).optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  subtasks: z
    .array(z.object({ title: z.string().min(1).max(500) }))
    .max(50)
    .default([]),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).optional().nullable(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional()
    .nullable(),
  duration: z.number().int().min(1).max(1440).optional().nullable(),
  completed: z.boolean().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  order: z.number().int().optional(),
});

export const reorderSchema = z.object({
  orderedIds: z.array(z.string()).min(1).max(200),
});

export const createSubtaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
});

export const updateSubtaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  completed: z.boolean().optional(),
});
