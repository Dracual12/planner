import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations/task";

// GET /api/tasks?date=2026-03-23 or ?from=...&to=...
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};

  if (date) {
    where.date = date;
  } else if (from && to) {
    where.date = { gte: from, lte: to };
  }

  const tasks = await prisma.task.findMany({
    where,
    include: { subtasks: { orderBy: { order: "asc" } }, recurrence: true },
    orderBy: [{ time: "asc" }, { order: "asc" }],
  });

  return NextResponse.json(tasks);
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { subtasks, ...data } = parsed.data;

  const task = await prisma.task.create({
    data: {
      ...data,
      subtasks: {
        create: subtasks.map((s, i) => ({
          title: s.title,
          order: i,
        })),
      },
    },
    include: { subtasks: true, recurrence: true },
  });

  return NextResponse.json(task, { status: 201 });
}
