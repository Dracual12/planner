"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, SortAsc } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { TaskCard } from "@/components/tasks/TaskCard";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { Priority } from "@/types/task";

type SortMode = "date" | "priority" | "name";

const priorityOrder: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const priorityLabels: Record<Priority, string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

const sortLabels: Record<SortMode, string> = {
  date: "дата",
  priority: "приоритет",
  name: "имя",
};

export default function TasksPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activePriority, setActivePriority] = useState<Priority | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("date");

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((t) => t.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [tasks]);

  const filtered = useMemo(() => {
    let result = tasks.filter((t) => {
      if (!showCompleted && t.completed) return false;
      if (activeTag && !t.tags.includes(activeTag)) return false;
      if (activePriority && t.priority !== activePriority) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sortMode === "date") {
        const cmp = a.date.localeCompare(b.date);
        if (cmp !== 0) return cmp;
        if (a.time && b.time) return a.time.localeCompare(b.time);
        if (a.time) return -1;
        if (b.time) return 1;
        return 0;
      }
      if (sortMode === "priority") {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [tasks, activeTag, activePriority, showCompleted, sortMode]);

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
        Все задачи
      </h2>

      <div className="glass rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={14} className="text-[var(--text-secondary)]" />
          <span className="text-xs text-[var(--text-secondary)]">Фильтр</span>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`touch-target-sm rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  activeTag === tag
                    ? "bg-[var(--accent-neon)]/20 text-[var(--accent-neon)]"
                    : "bg-[var(--bg-glass)] text-[var(--text-secondary)]"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {(["high", "medium", "low"] as Priority[]).map((p) => (
            <button
              key={p}
              onClick={() =>
                setActivePriority(activePriority === p ? null : p)
              }
              className={`touch-target-sm rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${
                activePriority === p
                  ? "ring-1 ring-current"
                  : "opacity-50"
              }`}
              style={{
                color: `var(--priority-${p})`,
                backgroundColor: `color-mix(in srgb, var(--priority-${p}) 15%, transparent)`,
              }}
            >
              {priorityLabels[p]}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() =>
                setSortMode((m) =>
                  m === "date" ? "priority" : m === "priority" ? "name" : "date"
                )
              }
              className="touch-target-sm flex items-center gap-1 rounded-lg bg-[var(--bg-glass)] px-2 py-1 text-[10px] text-[var(--text-secondary)]"
            >
              <SortAsc size={12} />
              {sortLabels[sortMode]}
            </button>

            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`touch-target-sm rounded-lg px-2 py-1 text-[10px] transition-colors ${
                showCompleted
                  ? "bg-[var(--accent-neon)]/20 text-[var(--accent-neon)]"
                  : "bg-[var(--bg-glass)] text-[var(--text-secondary)]"
              }`}
            >
              {showCompleted ? `Готово (${completedCount})` : "Показать готовые"}
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-[var(--text-secondary)]">
        {filtered.length} {filtered.length === 1 ? "задача" : filtered.length < 5 ? "задачи" : "задач"}
        {activeTag ? ` с тегом #${activeTag}` : ""}
        {activePriority ? ` · ${priorityLabels[activePriority].toLowerCase()}` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            {tasks.length === 0
              ? "Задач пока нет. Нажмите +, чтобы создать."
              : "Нет задач, подходящих под фильтры."}
          </p>
        </div>
      ) : (
        <motion.div
          className="flex flex-col gap-2"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filtered.map((task) => (
              <motion.div key={task.id} variants={staggerItem}>
                <TaskCard task={task} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
