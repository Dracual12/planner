"use client";

import { useCallback, useMemo } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Clock, GripVertical } from "lucide-react";
import type { Task } from "@/types/task";
import { useTaskStore } from "@/store/taskStore";
import { PriorityBadge } from "./PriorityBadge";

interface TimelineViewProps {
  tasks: Task[];
  dateKey: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const SLOT_HEIGHT = 60; // px per hour

function formatHour(h: number) {
  return `${h.toString().padStart(2, "0")}:00`;
}

function TimeSlot({ hour }: { hour: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${hour.toString().padStart(2, "0")}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative flex border-t border-[var(--border-glass)] transition-colors ${
        isOver ? "bg-[var(--accent-neon)]/5" : ""
      }`}
      style={{ height: SLOT_HEIGHT }}
    >
      <span className="w-14 flex-shrink-0 pt-1 text-right pr-2 text-[10px] text-[var(--text-muted)]">
        {formatHour(hour)}
      </span>
      <div className="flex-1" />
    </div>
  );
}

function DraggableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.8 : 1,
      }
    : undefined;

  const priorityColor: Record<string, string> = {
    high: "var(--priority-high)",
    medium: "var(--priority-medium)",
    low: "var(--priority-low)",
  };

  const topMinutes = task.time
    ? parseInt(task.time.split(":")[0]) * 60 + parseInt(task.time.split(":")[1])
    : 0;
  const top = (topMinutes / 60) * SLOT_HEIGHT;
  const height = task.duration
    ? Math.max((task.duration / 60) * SLOT_HEIGHT, 28)
    : 28;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        top,
        left: "3.5rem",
        right: "0.5rem",
        height,
        ...style,
      }}
    >
      <motion.div
        layout
        className={`glass flex h-full items-center gap-2 overflow-hidden rounded-xl px-2 ${
          isDragging ? "neon-glow" : ""
        }`}
        style={{ borderLeft: `3px solid ${priorityColor[task.priority]}` }}
      >
        <button
          {...attributes}
          {...listeners}
          className="touch-target-sm flex-shrink-0 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={12} className="text-[var(--text-muted)]" />
        </button>
        <span
          className={`truncate text-xs font-medium ${
            task.completed
              ? "text-[var(--text-muted)] line-through"
              : "text-[var(--text-primary)]"
          }`}
        >
          {task.title}
        </span>
        <PriorityBadge priority={task.priority} />
        {task.time && (
          <span className="ml-auto flex-shrink-0 text-[9px] text-[var(--text-secondary)]">
            {task.time}
          </span>
        )}
      </motion.div>
    </div>
  );
}

function UnscheduledTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.8 : 1,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`glass flex items-center gap-2 rounded-xl px-3 py-2 ${
          isDragging ? "neon-glow" : ""
        }`}
      >
        <button
          {...attributes}
          {...listeners}
          className="touch-target-sm flex-shrink-0 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={12} className="text-[var(--text-muted)]" />
        </button>
        <span className="truncate text-xs text-[var(--text-primary)]">
          {task.title}
        </span>
        <PriorityBadge priority={task.priority} />
      </div>
    </div>
  );
}

export function TimelineView({ tasks, dateKey }: TimelineViewProps) {
  const updateTask = useTaskStore((s) => s.updateTask);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const { scheduled, unscheduled } = useMemo(() => {
    const scheduled = tasks.filter((t) => t.time);
    const unscheduled = tasks.filter((t) => !t.time);
    return { scheduled, unscheduled };
  }, [tasks]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const overId = over.id as string;
      if (!overId.startsWith("slot-")) return;

      const hour = overId.replace("slot-", "");
      const time = `${hour}:00`;
      updateTask(active.id as string, { time });
    },
    [updateTask]
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {/* Unscheduled tasks */}
      {unscheduled.length > 0 && (
        <div className="mb-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Clock size={12} className="text-[var(--text-muted)]" />
            <span className="text-[10px] text-[var(--text-secondary)]">
              Без времени — перетащите на слот
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {unscheduled.map((task) => (
              <UnscheduledTask key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Timeline grid */}
      <div className="relative glass rounded-2xl overflow-hidden">
        {/* Hour slots (droppable) */}
        {HOURS.map((h) => (
          <TimeSlot key={h} hour={h} />
        ))}

        {/* Scheduled tasks (positioned absolutely) */}
        {scheduled.map((task) => (
          <DraggableTask key={task.id} task={task} />
        ))}

        {/* Current time indicator */}
        <CurrentTimeLine />
      </div>
    </DndContext>
  );
}

function CurrentTimeLine() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const top = (minutes / 60) * SLOT_HEIGHT;

  return (
    <div
      className="pointer-events-none absolute left-14 right-0"
      style={{ top }}
    >
      <div className="flex items-center">
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--priority-high)]" />
        <div className="h-px flex-1 bg-[var(--priority-high)]/50" />
      </div>
    </div>
  );
}
