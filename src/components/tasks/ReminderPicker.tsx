"use client";

import { Bell, BellOff } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { usePushSubscription } from "@/hooks/usePushSubscription";

type ReminderOffset = "at-time" | "15min" | "1h" | "1day" | "none";

const options: { value: ReminderOffset; label: string }[] = [
  { value: "none", label: "Без напоминания" },
  { value: "at-time", label: "В момент" },
  { value: "15min", label: "За 15 мин" },
  { value: "1h", label: "За 1 час" },
  { value: "1day", label: "За 1 день" },
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
  const { subscribe } = usePushSubscription();

  const handleChange = async (offset: ReminderOffset) => {
    if (offset !== "none" && permission === "default") {
      const result = await requestPermission();
      if (result !== "granted") return;
      // Register push subscription after granting permission
      subscribe();
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
          Напоминание
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
          Уведомления заблокированы. Включите в настройках браузера.
        </p>
      )}
    </div>
  );
}

export type { ReminderOffset };
