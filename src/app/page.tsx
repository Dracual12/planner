"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { List, Clock } from "lucide-react";
import { DayStrip } from "@/components/calendar/DayStrip";
import { WeekStrip } from "@/components/calendar/WeekStrip";
import {
  CalendarToggle,
  type CalendarView,
} from "@/components/calendar/CalendarToggle";
import { TaskList } from "@/components/tasks/TaskList";
import { useTaskStore } from "@/store/taskStore";

const TimelineView = dynamic(
  () => import("@/components/tasks/TimelineView").then((m) => m.TimelineView),
  { ssr: false }
);

type TaskView = "list" | "timeline";

export default function TodayPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("calendarView") as CalendarView) || "day";
    }
    return "day";
  });
  const [taskView, setTaskView] = useState<TaskView>("list");

  useEffect(() => {
    localStorage.setItem("calendarView", calendarView);
  }, [calendarView]);

  const dateLabel = format(selectedDate, "EEEE, MMMM d");
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const getTasksByDate = useTaskStore((s) => s.getTasksByDate);
  const tasks = useMemo(() => getTasksByDate(dateKey), [getTasksByDate, dateKey]);

  return (
    <div className="flex flex-col gap-4">
      {/* Calendar section */}
      <div className="glass rounded-2xl p-3">
        <div className="mb-2 flex items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.h2
              key={dateLabel}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="text-lg font-semibold text-[var(--text-primary)]"
            >
              {dateLabel}
            </motion.h2>
          </AnimatePresence>
          <CalendarToggle view={calendarView} onToggle={setCalendarView} />
        </div>

        <AnimatePresence mode="wait">
          {calendarView === "day" ? (
            <motion.div
              key="day"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <DayStrip
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </motion.div>
          ) : (
            <motion.div
              key="week"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <WeekStrip
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-[var(--text-secondary)]">
            Tasks
          </h2>
          {/* List / Timeline toggle */}
          <div className="flex rounded-lg bg-[var(--bg-glass)] p-0.5">
            <button
              onClick={() => setTaskView("list")}
              className={`touch-target-sm flex items-center gap-1 rounded-md px-2 py-1 text-[10px] transition-colors ${
                taskView === "list"
                  ? "bg-[var(--accent-neon)]/20 text-[var(--accent-neon)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              <List size={12} />
              List
            </button>
            <button
              onClick={() => setTaskView("timeline")}
              className={`touch-target-sm flex items-center gap-1 rounded-md px-2 py-1 text-[10px] transition-colors ${
                taskView === "timeline"
                  ? "bg-[var(--accent-neon)]/20 text-[var(--accent-neon)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              <Clock size={12} />
              Timeline
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {taskView === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <TaskList selectedDate={selectedDate} />
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <TimelineView tasks={tasks} dateKey={dateKey} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
