import type { Priority } from "@/types/task";

const priorityConfig: Record<Priority, { color: string; label: string }> = {
  high: { color: "var(--priority-high)", label: "H" },
  medium: { color: "var(--priority-medium)", label: "M" },
  low: { color: "var(--priority-low)", label: "L" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority];
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold"
      style={{ backgroundColor: `${config.color}20`, color: config.color }}
    >
      {config.label}
    </span>
  );
}
