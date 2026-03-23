"use client";

import { useCallback, useEffect, useRef, useState, useReducer } from "react";
import { addDays, subDays, startOfDay, format } from "date-fns";
import { DayCell } from "./DayCell";
import { useTaskStore } from "@/store/taskStore";

interface DayStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const BATCH_SIZE = 30;

function generateDays(center: Date, pastDays: number, futureDays: number) {
  const days: Date[] = [];
  for (let i = -pastDays; i <= futureDays; i++) {
    days.push(startOfDay(addDays(center, i)));
  }
  return days;
}

export function DayStrip({ selectedDate, onSelectDate }: DayStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState(() =>
    generateDays(new Date(), BATCH_SIZE, BATCH_SIZE)
  );
  const isLoadingRef = useRef(false);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    return useTaskStore.subscribe(forceUpdate);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.style.scrollBehavior = "auto";
    const todayIndex = BATCH_SIZE;

    // Measure real cell width instead of hardcoding
    const firstCell = container.children[0] as HTMLElement | undefined;
    if (firstCell) {
      const cellRect = firstCell.getBoundingClientRect();
      const gap = 4; // gap-1 = 0.25rem = 4px
      const step = cellRect.width + gap;
      const scrollPosition =
        todayIndex * step - container.clientWidth / 2 + cellRect.width / 2;
      container.scrollLeft = scrollPosition;
    }

    requestAnimationFrame(() => {
      container.style.scrollBehavior = "";
    });
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isLoadingRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const threshold = 200;

    if (scrollLeft < threshold) {
      isLoadingRef.current = true;
      const firstDay = days[0];
      const newDays = generateDays(
        subDays(firstDay, BATCH_SIZE),
        0,
        BATCH_SIZE - 1
      );

      // Measure real cell step before prepending
      const firstCell = container.children[0] as HTMLElement | undefined;
      const step = firstCell ? firstCell.getBoundingClientRect().width + 4 : 68;

      setDays((prev) => [...newDays, ...prev]);

      requestAnimationFrame(() => {
        if (container) {
          container.scrollLeft += newDays.length * step;
        }
        isLoadingRef.current = false;
      });
    }

    if (scrollLeft + clientWidth > scrollWidth - threshold) {
      isLoadingRef.current = true;
      const lastDay = days[days.length - 1];
      const newDays = generateDays(addDays(lastDay, 1), 0, BATCH_SIZE - 1);

      setDays((prev) => [...prev, ...newDays]);

      requestAnimationFrame(() => {
        isLoadingRef.current = false;
      });
    }
  }, [days]);

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="scrollbar-hide flex gap-1 overflow-x-auto py-2"
      style={{ scrollSnapType: "x proximity" }}
    >
      {days.map((day) => (
        <DayCell
          key={day.toISOString()}
          date={day}
          selected={
            startOfDay(selectedDate).getTime() === day.getTime()
          }
          hasTasks={useTaskStore.getState().getTasksByDate(format(day, "yyyy-MM-dd")).length > 0}
          onSelect={onSelectDate}
        />
      ))}
    </div>
  );
}
