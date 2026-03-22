"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addDays, subDays, startOfDay } from "date-fns";
import { DayCell } from "./DayCell";

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

  // Scroll to selected date on mount
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const todayIndex = BATCH_SIZE; // center of initial array
    const cellWidth = 60; // approximate cell width
    const scrollPosition =
      todayIndex * cellWidth - container.clientWidth / 2 + cellWidth / 2;
    container.scrollLeft = scrollPosition;
  }, []);

  // Infinite scroll: prepend/append days when near edges
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isLoadingRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const threshold = 200;

    // Near left edge → prepend days
    if (scrollLeft < threshold) {
      isLoadingRef.current = true;
      const firstDay = days[0];
      const newDays = generateDays(
        subDays(firstDay, BATCH_SIZE),
        0,
        BATCH_SIZE - 1
      );

      setDays((prev) => [...newDays, ...prev]);

      // Maintain scroll position after prepend
      requestAnimationFrame(() => {
        if (container) {
          container.scrollLeft += newDays.length * 60;
        }
        isLoadingRef.current = false;
      });
    }

    // Near right edge → append days
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
      className="scrollbar-hide flex gap-1 overflow-x-auto scroll-smooth py-2"
      style={{ scrollSnapType: "x proximity" }}
    >
      {days.map((day) => (
        <DayCell
          key={day.toISOString()}
          date={day}
          selected={
            startOfDay(selectedDate).getTime() === day.getTime()
          }
          onSelect={onSelectDate}
        />
      ))}
    </div>
  );
}
