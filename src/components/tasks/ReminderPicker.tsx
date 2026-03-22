"use client";

import { Bell, BellOff } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

type ReminderOffset = "at-time" | "15min" | "1h" | "1day" | "none";

const options: { value: ReminderOffset; label: string }[] = [
  { value: "none", label: "No reminder" },
  { value: "at-time", label: "At time" },
  { value: "15min", label: "15 min before" },
  { value: "1h", label: "1 hour before" },
  { value: "1day", label: "1 day before" },
];

interface ReminderPickerProps {
  value: ReminderOffset;
  onChange: (offset: ReminderOffset) => void;
  hasTime: boolean;
}

export function ReminderPicker({
  value,
  onChange,
  hasTime,
}: ReminderPickerProps) {
  const { permission, requestPermission } = useNotifications();

  const handleChange = async (offset: ReminderOffset) => {
    if (offset !== "none" && permission === "default") {
      const result = await requestPermission();
      if (result !== "granted") return;
    }
    onChange(offset);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        {value === "none" ? (
          <BellOff size={12} className="text-[var(--text-muted)]" />
        ) : (
          <Bell size={12} className="text-[var(--accent-neon)]" />
        )}
        <span className="text-[10px] text-[var(--text-secondary)]">
          Reminder
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {options
          .filter((o) => o.value === "none" || o.value === "1day" || hasTime)
          .map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange(option.value)}
              className={`rounded-lg px-2 py-1 text-[10px] transition-colors ${
                value === option.value
                  ? "bg-[var(--accent-neon)]/20 text-[var(--accent-neon)]"
                  : "bg-[var(--bg-glass)] text-[var(--text-secondary)]"
              }`}
            >
              {option.label}
            </button>
          ))}
      </div>
      {permission === "denied" && (
        <p className="text-[9px] text-[var(--priority-high)]">
          Notifications blocked. Enable in browser settings.
        </p>
      )}
    </div>
  );
}

export type { ReminderOffset };
