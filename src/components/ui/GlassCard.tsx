"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type GlassLevel = "subtle" | "medium" | "heavy";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  level?: GlassLevel;
  glow?: boolean;
  children: React.ReactNode;
}

const glassClass: Record<GlassLevel, string> = {
  subtle: "glass",
  medium: "glass-medium",
  heavy: "glass-heavy",
};

export function GlassCard({
  level = "subtle",
  glow = false,
  children,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={`${glassClass[level]} rounded-2xl ${glow ? "inner-glow" : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
