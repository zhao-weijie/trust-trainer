import type { ReactNode } from "react";

export type StatusBadgeTone = "info" | "success" | "danger" | "warning" | "muted" | "draft";

export type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusBadgeTone;
  className?: string;
};

export function StatusBadge({ children, tone = "muted", className = "" }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${tone} ${className}`.trim()}>{children}</span>;
}
