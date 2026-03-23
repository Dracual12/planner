"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { format } from "date-fns";
import type { Priority } from "@/types/task";
import { useTaskStore } from "@/store/taskStore";
import { parseTaskInput } from "@/lib/parseTaskInput";
import { ReminderPicker, type ReminderOffset } from "./ReminderPicker";
import { RecurrencePicker } from "./RecurrencePicker";
import { computeReminderTime } from "@/lib/notifications/scheduler";
import { modalSlideUp, backdropFade, springSnappy } from "@/lib/animations";
import type { RecurrenceRule } from "@/types/task";

interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
  defaultDate: Date;
}

const priorities: { value: Priority; color: string; label: string }[] = [
  { value: "high", color: "var(--priority-high)", label: "H" },
  { value: "medium", color: "var(--priority-medium)", label: "M" },
  { value: "low", color: "var(--priority-low)", label: "L" },
];

export function QuickAddModal({
  open,
  onClose,
  defaultDate,
}: QuickAddModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [date, setDate] = useState(() => format(defaultDate, "yyyy-MM-dd"));
  const [showMore, setShowMore] = useState(false);
  const [time, setTime] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [description, setDescription] = useState("");
  const [reminderOffset, setReminderOffset] = useState<ReminderOffset>("none");
  const [recurrence, setRecurrence] = useState<RecurrenceRule | null>(null);
  const addTask = useTaskStore((s) => s.addTask);

  // Update date when defaultDate changes
  useEffect(() => {
    setDate(format(defaultDate, "yyyy-MM-dd"));
  }, [defaultDate]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Reset form
      setTitle("");
      setPriority("medium");
      setShowMore(false);
      setTime("");
      setTagsInput("");
      setDescription("");
      setReminderOffset("none");
      setRecurrence(null);
    }
  }, [open]);

  const handleSubmit = useCallback(() => {
    if (!title.trim()) return;

    // Parse inline tokens from title
    const parsed = parseTaskInput(title);

    const tags = [
      ...parsed.tags,
      ...tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ];

    const taskDate = parsed.date ?? date;
    const taskTime = time || undefined;
    const reminder =
      reminderOffset !== "none"
        ? computeReminderTime(taskDate, taskTime, reminderOffset)
        : undefined;

    addTask({
      title: parsed.title || title.trim(),
      priority: parsed.priority ?? priority,
      date: taskDate,
      time: taskTime,
      tags,
      description: description || undefined,
      subtasks: [],
      reminder,
      recurrence: recurrence ?? undefined,
    });

    onClose();
  }, [title, priority, date, time, tagsInput, description, recurrence, addTask, onClose]);

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
          {/* Backdrop */}
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            variants={modalSlideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={springSnappy}
            className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-md glass-heavy rounded-3xl p-4"
            style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Быстрое добавление
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-[var(--bg-glass-heavy)]"
              >
                <X size={18} className="text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Title input */}
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Название задачи... (#тег !h завтра)"
              className="w-full rounded-xl bg-[var(--bg-glass)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:inner-glow"
            />

            {/* Quick options row */}
            <div className="mt-3 flex items-center gap-3">
              {/* Date pill */}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-lg bg-[var(--bg-glass)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
              />

              {/* Time input — always visible */}
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-[var(--text-muted)]" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="rounded-lg bg-[var(--bg-glass)] px-2 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              {/* Priority selector */}
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
                      ...(priority === p.value
                        ? { ringColor: p.color }
                        : {}),
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* More toggle */}
              <button
                onClick={() => setShowMore(!showMore)}
                className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-glass)]"
              >
                Ещё
                {showMore ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            </div>

            {/* Expanded options */}
            <AnimatePresence>
              {showMore && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 flex flex-col gap-2">
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
                    <RecurrencePicker
                      value={recurrence}
                      onChange={setRecurrence}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="mt-3 w-full rounded-xl bg-[var(--accent-neon)] py-2.5 text-sm font-semibold text-white transition-all hover:neon-glow disabled:opacity-30"
            >
              Добавить
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
