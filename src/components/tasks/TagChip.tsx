export function TagChip({ tag }: { tag: string }) {
  return (
    <span className="rounded-full bg-[var(--accent-neon)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--accent-neon)]">
      #{tag}
    </span>
  );
}
