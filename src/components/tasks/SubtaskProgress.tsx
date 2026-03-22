import type { Subtask } from "@/types/task";

export function SubtaskProgress({ subtasks }: { subtasks: Subtask[] }) {
  if (subtasks.length === 0) return null;

  const done = subtasks.filter((s) => s.completed).length;
  const total = subtasks.length;
  const percent = (done / total) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--bg-glass-heavy)]">
        <div
          className="h-full rounded-full bg-[var(--accent-neon)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] text-[var(--text-secondary)]">
        {done}/{total}
      </span>
    </div>
  );
}
