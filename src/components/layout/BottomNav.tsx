"use client";

import { CalendarDays, CheckSquare, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  { href: "/", icon: CalendarDays, label: "Today" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/settings", icon: Settings, label: "Settings" },
] as const;

export function BottomNav({ onQuickAdd }: { onQuickAdd: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      className="glass-heavy fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {/* First tab */}
        <NavTab
          href={tabs[0].href}
          icon={tabs[0].icon}
          label={tabs[0].label}
          active={pathname === tabs[0].href}
        />

        {/* Second tab */}
        <NavTab
          href={tabs[1].href}
          icon={tabs[1].icon}
          label={tabs[1].label}
          active={pathname === tabs[1].href}
        />

        {/* Center FAB button */}
        <button
          onClick={onQuickAdd}
          className="neon-glow -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-neon)] text-white shadow-lg transition-transform active:scale-95"
          aria-label="Quick Add"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>

        {/* Third tab */}
        <NavTab
          href={tabs[2].href}
          icon={tabs[2].icon}
          label={tabs[2].label}
          active={pathname === tabs[2].href}
        />

        {/* Empty spacer to balance the layout */}
        <div className="w-12" />
      </div>
    </nav>
  );
}

function NavTab({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="relative flex w-12 flex-col items-center gap-0.5 py-1"
    >
      <Icon
        size={22}
        className={active ? "text-[var(--accent-neon)]" : "text-[var(--text-secondary)]"}
      />
      <span
        className={`text-[10px] ${
          active ? "text-[var(--accent-neon)]" : "text-[var(--text-secondary)]"
        }`}
      >
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-1 h-0.5 w-6 rounded-full bg-[var(--accent-neon)]"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
    </Link>
  );
}
