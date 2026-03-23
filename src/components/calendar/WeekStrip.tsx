"use client";

import { useState, useCallback } from "react";
import {
  addWeeks,
  subWeeks,
  startOfWeek,
  addDays,
  startOfDay,
  isToday,
  format,
} from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/store/taskStore";

interface WeekStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function WeekStrip({ selectedDate, onSelectDate }: WeekStripProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(selectedDate, { weekStartsOn: 1 })
  );
  const [direction, setDirection] = useState(0);
  const getTasksByDate = useTaskStore((s) => s.getTasksByDate);

  const weekDays = getWeekDays(currentWeekStart);

  const goToPrevWeek = useCallback(() => {
    setDirection(-1);
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  }, []);

  const goToNextWeek = useCallback(() => {
    setDirection(1);
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  }, []);

  const handleSelect = useCallback(
    (date: Date) => {
      onSelectDate(date);
    },
    [onSelectDate]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <button
          onClick={goToPrevWeek}
          className="rounded-lg p-1 transition-colors hover:bg-[var(--bg-glass-heavy)]"
        >
          <ChevronLeft size={18} className="text-[var(--text-secondary)]" />
        </button>
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          {format(currentWeekStart, "LLLL yyyy", { locale: ru })}
        </span>
        <button
          onClick={goToNextWeek}
          className="rounded-lg p-1 transition-colors hover:bg-[var(--bg-glass-heavy)]"
        >
          <ChevronRight size={18} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentWeekStart.toISOString()}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-7 gap-1"
        >
          {weekDays.map((day) => {
            const isSelected =
              startOfDay(selectedDate).getTime() === startOfDay(day).getTime();
            const today = isToday(day);
            const hasTasks = getTasksByDate(format(day, "yyyy-MM-dd")).length > 0;

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleSelect(day)}
                className="relative flex flex-col items-center gap-1 rounded-xl py-2 transition-colors"
              >
                <span
                  className={`text-[10px] font-medium uppercase ${
                    today
                      ? "text-[var(--accent-neon)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {format(day, "EEEEEE", { locale: ru })}
                </span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    isSelected
                      ? "bg-[var(--accent-neon)] text-white"
                      : today
                        ? "text-[var(--accent-neon)]"
                        : "text-[var(--text-primary)]"
                  }`}
                >
                  {format(day, "d")}
                </span>
                {hasTasks && !isSelected && (
                  <div className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[var(--accent-neon)]" />
                )}
                {isSelected && (
                  <motion.div
                    layoutId="week-selected"
                    className="absolute inset-0 rounded-xl border border-[var(--accent-neon)] bg-[var(--accent-neon)]/5"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
