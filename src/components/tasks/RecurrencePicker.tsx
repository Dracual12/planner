"use client";

import { Repeat } from "lucide-react";
import type { RecurrenceRule } from "@/types/task";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const presets: { label: string; rule: RecurrenceRule | null }[] = [
  { label: "None", rule: null },
  { label: "Daily", rule: { frequency: "daily", interval: 1 } },
  { label: "Weekly", rule: { frequency: "weekly", interval: 1 } },
  { label: "Monthly", rule: { frequency: "monthly", interval: 1 } },
];

interface RecurrencePickerProps {
  value: RecurrenceRule | null;
  onChange: (rule: RecurrenceRule | null) => void;
}

export function RecurrencePicker({ value, onChange }: RecurrencePickerProps) {
  const activePreset = value
    ? presets.find(
        (p) =>
          p.rule?.frequency === value.frequency &&
          p.rule?.interval === value.interval
      )
    : presets[0];

  const toggleDay = (day: number) => {
    if (!value || value.frequency !== "weekly") return;
    const days = value.days ?? [];
    const next = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day].sort();
    onChange({ ...value, days: next.length > 0 ? next : undefined });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Repeat
          size={12}
          className={
            value
              ? "text-[var(--accent-cyan)]"
              : "text-[var(--text-muted)]"
          }
        />
        <span className="text-[10px] text-[var(--text-secondary)]">
          Repeat
        </span>
      </div>

      {/* Frequency presets */}
      <div className="flex flex-wrap gap-1">
        {presets.map((preset) => {
          const isActive =
            (!value && !preset.rule) ||
            (value &&
              preset.rule &&
              value.frequency === preset.rule.frequency &&
              value.interval === preset.rule.interval);
          return (
            <button
              key={preset.label}
              onClick={() => onChange(preset.rule)}
              className={`touch-target-sm rounded-lg px-2 py-1 text-[10px] transition-colors ${
                isActive
                  ? "bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]"
                  : "bg-[var(--bg-glass)] text-[var(--text-secondary)]"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Interval selector for non-preset values */}
      {value && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-secondary)]">
            Every
          </span>
          <input
            type="number"
            min={1}
            max={99}
            value={value.interval}
            onChange={(e) =>
              onChange({ ...value, interval: Math.max(1, Number(e.target.value)) })
            }
            className="touch-target-sm w-12 rounded-lg bg-[var(--bg-glass)] px-2 py-1 text-center text-[10px] text-[var(--text-primary)] focus:outline-none"
          />
          <span className="text-[10px] text-[var(--text-secondary)]">
            {value.frequency === "daily"
              ? "day(s)"
              : value.frequency === "weekly"
                ? "week(s)"
                : "month(s)"}
          </span>
        </div>
      )}

      {/* Day picker for weekly */}
      {value?.frequency === "weekly" && (
        <div className="flex gap-1">
          {DAY_LABELS.map((label, i) => {
            const isActive = value.days?.includes(i);
            return (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                className={`touch-target-sm flex h-6 w-8 items-center justify-center rounded-md text-[9px] font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]"
                    : "bg-[var(--bg-glass)] text-[var(--text-muted)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
