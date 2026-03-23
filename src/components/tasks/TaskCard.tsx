"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Bell, Check, Clock, Repeat, Trash2 } from "lucide-react";
import type { Task } from "@/types/task";
import { PriorityBadge } from "./PriorityBadge";
import { SubtaskProgress } from "./SubtaskProgress";
import { TagChip } from "./TagChip";
import { useTaskStore } from "@/store/taskStore";
import { springSnappy } from "@/lib/animations";

interface TaskCardProps {
  task: Task;
}

const priorityBorderColor: Record<Task["priority"], string> = {
  high: "var(--priority-high)",
  medium: "var(--priority-medium)",
  low: "var(--priority-low)",
};

const DELETE_THRESHOLD = -100;

function haptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const toggleComplete = useTaskStore((s) => s.toggleComplete);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const [dismissed, setDismissed] = useState(false);

  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-120, -60], [1, 0]);
  const deleteScale = useTransform(x, [-120, -60], [1, 0.6]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < DELETE_THRESHOLD) {
      haptic();
      setDismissed(true);
      setTimeout(() => deleteTask(task.id), 300);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end rounded-2xl bg-[var(--priority-high)]/20 pr-5"
        style={{ opacity: deleteOpacity }}
      >
        <motion.div style={{ scale: deleteScale }}>
          <Trash2 size={20} className="text-[var(--priority-high)]" />
        </motion.div>
      </motion.div>

      {/* Swipeable card */}
      <motion.div
        layout
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.4, right: 0 }}
        dragDirectionLock
        onDragEnd={handleDragEnd}
        animate={dismissed ? { x: -400, opacity: 0 } : { x: 0 }}
        transition={dismissed ? { duration: 0.25 } : undefined}
        className="glass group relative rounded-2xl p-3"
        style={{
          x,
          borderLeft: `3px solid ${priorityBorderColor[task.priority]}`,
        }}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => {
              haptic();
              toggleComplete(task.id);
            }}
            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all ${
              task.completed
                ? "border-[var(--accent-neon)] bg-[var(--accent-neon)]"
                : "border-[var(--border-glass-heavy)]"
            }`}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={springSnappy}
              >
                <Check size={12} className="text-white" strokeWidth={3} />
              </motion.div>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  task.completed
                    ? "text-[var(--text-muted)] line-through"
                    : "text-[var(--text-primary)]"
                }`}
              >
                {task.title}
              </span>
              <PriorityBadge priority={task.priority} />
              {task.recurrence && (
                <Repeat size={11} className="text-[var(--accent-cyan)]" />
              )}
              {task.reminder && (
                <Bell size={11} className="text-[var(--accent-neon)]" />
              )}
            </div>

            {/* Time slot */}
            {task.time && (
              <div className="mt-1 flex items-center gap-1">
                <Clock size={11} className="text-[var(--text-secondary)]" />
                <span className="text-[11px] text-[var(--text-secondary)]">
                  {task.time}
                  {task.duration && ` · ${task.duration} мин`}
                </span>
              </div>
            )}

            {/* Description */}
            {task.description && (
              <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Subtask progress */}
            {task.subtasks.length > 0 && (
              <div className="mt-2">
                <SubtaskProgress subtasks={task.subtasks} />
              </div>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {task.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>

          {/* Delete button (desktop hover) */}
          <button
            onClick={() => deleteTask(task.id)}
            className="flex-shrink-0 rounded-lg p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[var(--priority-high)]/10"
          >
            <Trash2 size={14} className="text-[var(--text-muted)]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
