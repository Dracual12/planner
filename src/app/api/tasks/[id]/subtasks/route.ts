import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSubtaskSchema,
  updateSubtaskSchema,
} from "@/lib/validations/task";

// POST /api/tasks/[id]/subtasks
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const body = await request.json();
  const parsed = createSubtaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Get max order for this task's subtasks
  const maxOrder = await prisma.subtask.aggregate({
    where: { taskId },
    _max: { order: true },
  });

  const subtask = await prisma.subtask.create({
    data: {
      title: parsed.data.title,
      taskId,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json(subtask, { status: 201 });
}

// PATCH /api/tasks/[id]/subtasks?subId=xxx
export async function PATCH(request: NextRequest) {
  const subId = request.nextUrl.searchParams.get("subId");
  if (!subId) {
    return NextResponse.json(
      { error: "subId query parameter required" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const parsed = updateSubtaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const subtask = await prisma.subtask.update({
      where: { id: subId },
      data: parsed.data,
    });
    return NextResponse.json(subtask);
  } catch {
    return NextResponse.json(
      { error: "Subtask not found" },
      { status: 404 }
    );
  }
}

// DELETE /api/tasks/[id]/subtasks?subId=xxx
export async function DELETE(request: NextRequest) {
  const subId = request.nextUrl.searchParams.get("subId");
  if (!subId) {
    return NextResponse.json(
      { error: "subId query parameter required" },
      { status: 400 }
    );
  }

  try {
    await prisma.subtask.delete({ where: { id: subId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Subtask not found" },
      { status: 404 }
    );
  }
}
