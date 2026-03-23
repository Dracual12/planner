"use client";

import { format, isToday } from "date-fns";
import { ru } from "date-fns/locale";
import { motion } from "framer-motion";

interface DayCellProps {
  date: Date;
  selected: boolean;
  hasTasks?: boolean;
  onSelect: (date: Date) => void;
}

export function DayCell({ date, selected, hasTasks, onSelect }: DayCellProps) {
  const today = isToday(date);

  return (
    <button
      onClick={() => onSelect(date)}
      className="relative flex flex-shrink-0 flex-col items-center gap-0.5 rounded-2xl px-3 py-2 transition-colors"
    >
      <span
        className={`text-[10px] font-medium uppercase ${
          today
            ? "text-[var(--accent-neon)]"
            : selected
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-secondary)]"
        }`}
      >
        {format(date, "EEEEEE", { locale: ru })}
      </span>

      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
          selected
            ? "bg-[var(--accent-neon)] text-white"
            : today
              ? "text-[var(--accent-neon)]"
              : "text-[var(--text-primary)]"
        }`}
      >
        {format(date, "d")}
      </span>

      {/* Month label on 1st of month */}
      {date.getDate() === 1 && (
        <span className="text-[8px] font-medium text-[var(--accent-cyan)]">
          {format(date, "MMM", { locale: ru })}
        </span>
      )}

      {/* Task indicator dot */}
      {hasTasks && !selected && (
        <div className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[var(--accent-neon)]" />
      )}

      {/* Selection indicator */}
      {selected && (
        <motion.div
          layoutId="day-selected"
          className="absolute inset-0 rounded-2xl border border-[var(--accent-neon)] bg-[var(--accent-neon)]/5"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
    </button>
  );
}
