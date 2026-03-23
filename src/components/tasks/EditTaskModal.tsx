"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Priority, Task, RecurrenceRule } from "@/types/task";
import { useTaskStore } from "@/store/taskStore";
import { ReminderPicker, type ReminderOffset } from "./ReminderPicker";
import { RecurrencePicker } from "./RecurrencePicker";
import { computeReminderTime } from "@/lib/notifications/scheduler";
import { modalSlideUp, backdropFade, springSnappy } from "@/lib/animations";

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
}

const priorities: { value: Priority; color: string; label: string }[] = [
  { value: "high", color: "var(--priority-high)", label: "H" },
  { value: "medium", color: "var(--priority-medium)", label: "M" },
  { value: "low", color: "var(--priority-low)", label: "L" },
];

export function EditTaskModal({ open, onClose, task }: EditTaskModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [date, setDate] = useState(task.date);
  const [time, setTime] = useState(task.time ?? "");
  const [tagsInput, setTagsInput] = useState(task.tags.join(", "));
  const [description, setDescription] = useState(task.description ?? "");
  const [reminderOffset, setReminderOffset] = useState<ReminderOffset>("none");
  const [recurrence, setRecurrence] = useState<RecurrenceRule | null>(
    task.recurrence ?? null
  );
  const updateTask = useTaskStore((s) => s.updateTask);

  // Reset form when task changes
  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setPriority(task.priority);
      setDate(task.date);
      setTime(task.time ?? "");
      setTagsInput(task.tags.join(", "));
      setDescription(task.description ?? "");
      setReminderOffset("none");
      setRecurrence(task.recurrence ?? null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, task]);

  const handleSubmit = useCallback(() => {
    if (!title.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const taskTime = time || undefined;
    const reminder =
      reminderOffset !== "none"
        ? computeReminderTime(date, taskTime, reminderOffset)
        : task.reminder;

    updateTask(task.id, {
      title: title.trim(),
      priority,
      date,
      time: taskTime,
      tags,
      description: description || undefined,
      reminder,
      recurrence: recurrence ?? undefined,
    });

    onClose();
  }, [
    title,
    priority,
    date,
    time,
    tagsInput,
    description,
    recurrence,
    reminderOffset,
    task.id,
    task.reminder,
    updateTask,
    onClose,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        onClose();
      }
    },
    [handleSubmit, onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            variants={modalSlideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={springSnappy}
            className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-md glass-heavy rounded-3xl p-4"
            style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Редактировать
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-[var(--bg-glass-heavy)]"
              >
                <X size={18} className="text-[var(--text-secondary)]" />
              </button>
            </div>

            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Название задачи..."
              className="w-full rounded-xl bg-[var(--bg-glass)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:inner-glow"
            />

            <div className="mt-3 flex items-center gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-lg bg-[var(--bg-glass)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
              />

              <div className="flex gap-1">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                      priority === p.value
                        ? "ring-2 ring-offset-1 ring-offset-transparent"
                        : "opacity-40"
                    }`}
                    style={{
                      backgroundColor: `color-mix(in srgb, ${p.color} 20%, transparent)`,
                      color: p.color,
                      ...(priority === p.value ? { ringColor: p.color } : {}),
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[var(--text-secondary)]">Время</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="rounded-lg bg-[var(--bg-glass)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none"
                />
                {time && (
                  <button
                    onClick={() => setTime("")}
                    className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  >
                    Убрать
                  </button>
                )}
              </div>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Теги (через запятую)"
                className="rounded-lg bg-[var(--bg-glass)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Заметки..."
                rows={2}
                className="rounded-lg bg-[var(--bg-glass)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none resize-none"
              />
              <ReminderPicker
                value={reminderOffset}
                onChange={setReminderOffset}
                hasTime={!!time}
              />
              <RecurrencePicker value={recurrence} onChange={setRecurrence} />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="mt-3 w-full rounded-xl bg-[var(--accent-neon)] py-2.5 text-sm font-semibold text-white transition-all hover:neon-glow disabled:opacity-30"
            >
              Сохранить
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
