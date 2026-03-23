"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import type { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { useTaskStore } from "@/store/taskStore";
import { staggerContainer } from "@/lib/animations";

interface SortableTaskListProps {
  tasks: Task[];
  dateKey: string;
}

function SortableTaskItem({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative">
      <TaskCard task={task} />
      {/* Drag handle — only this element activates dnd-kit */}
      <button
        {...listeners}
        className="absolute right-1 top-1/2 -translate-y-1/2 touch-none rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-60 hover:opacity-100 active:opacity-100"
        aria-label="Перетащить"
      >
        <GripVertical size={14} className="text-[var(--text-muted)]" />
      </button>
    </div>
  );
}

export function SortableTaskList({ tasks, dateKey }: SortableTaskListProps) {
  const reorderTasks = useTaskStore((s) => s.reorderTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const ids = tasks.map((t) => t.id);
      const oldIndex = ids.indexOf(active.id as string);
      const newIndex = ids.indexOf(over.id as string);

      const newIds = [...ids];
      newIds.splice(oldIndex, 1);
      newIds.splice(newIndex, 0, active.id as string);

      reorderTasks(dateKey, newIds);
    },
    [tasks, dateKey, reorderTasks]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <motion.div
          className="flex flex-col gap-2"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {tasks.map((task) => (
              <SortableTaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}
