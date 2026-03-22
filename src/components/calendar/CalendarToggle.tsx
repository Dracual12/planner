"use client";

import { motion } from "framer-motion";

export type CalendarView = "day" | "week";

interface CalendarToggleProps {
  view: CalendarView;
  onToggle: (view: CalendarView) => void;
}

export function CalendarToggle({ view, onToggle }: CalendarToggleProps) {
  return (
    <div className="glass relative flex h-8 w-32 items-center rounded-full p-0.5">
      {/* Sliding background */}
      <motion.div
        className="absolute h-7 w-[calc(50%-2px)] rounded-full bg-[var(--accent-neon)]/20"
        animate={{ x: view === "day" ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />

      <button
        onClick={() => onToggle("day")}
        className={`relative z-10 flex-1 text-xs font-medium transition-colors ${
          view === "day"
            ? "text-[var(--accent-neon)]"
            : "text-[var(--text-secondary)]"
        }`}
      >
        Day
      </button>
      <button
        onClick={() => onToggle("week")}
        className={`relative z-10 flex-1 text-xs font-medium transition-colors ${
          view === "week"
            ? "text-[var(--accent-neon)]"
            : "text-[var(--text-secondary)]"
        }`}
      >
        Week
      </button>
    </div>
  );
}
