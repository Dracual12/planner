"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
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

const DELETE_THRESHOLD = 80;

function haptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const toggleComplete = useTaskStore((s) => s.toggleComplete);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const locked = useRef<"x" | "y" | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    locked.current = null;
    setSwiping(false);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    // Lock direction on first significant move
    if (!locked.current) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        locked.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
      return;
    }

    if (locked.current === "y") return;

    // Only allow swipe left
    const clamped = Math.min(0, dx);
    setOffsetX(clamped);
    setSwiping(true);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (offsetX < -DELETE_THRESHOLD) {
      haptic();
      setDismissed(true);
      setTimeout(() => deleteTask(task.id), 250);
    } else {
      setOffsetX(0);
    }
    setSwiping(false);
    locked.current = null;
  }, [offsetX, deleteTask, task.id]);

  const progress = Math.min(Math.abs(offsetX) / DELETE_THRESHOLD, 1);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete background */}
      <div
        className="absolute inset-0 flex items-center justify-end rounded-2xl bg-[var(--priority-high)]/20 pr-5"
        style={{ opacity: progress }}
      >
        <Trash2
          size={20}
          className="text-[var(--priority-high)]"
          style={{ transform: `scale(${0.6 + progress * 0.4})` }}
        />
      </div>

      {/* Card */}
      <motion.div
        animate={
          dismissed
            ? { x: -400, opacity: 0 }
            : swiping
              ? undefined
              : { x: 0 }
        }
        transition={dismissed ? { duration: 0.25 } : { type: "spring", stiffness: 400, damping: 30 }}
        className="glass group relative rounded-2xl p-3"
        style={{
          borderLeft: `3px solid ${priorityBorderColor[task.priority]}`,
          ...(swiping ? { transform: `translateX(${offsetX}px)` } : {}),
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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

            {task.time && (
              <div className="mt-1 flex items-center gap-1">
                <Clock size={11} className="text-[var(--text-secondary)]" />
                <span className="text-[11px] text-[var(--text-secondary)]">
                  {task.time}
                  {task.duration && ` · ${task.duration} мин`}
                </span>
              </div>
            )}

            {task.description && (
              <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2">
                {task.description}
              </p>
            )}

            {task.subtasks.length > 0 && (
              <div className="mt-2">
                <SubtaskProgress subtasks={task.subtasks} />
              </div>
            )}

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
