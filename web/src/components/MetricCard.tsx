import type { ReactNode } from "react";
import { Panel } from "./Panel";

export type MetricCardProps = {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  tone?: "neutral" | "success" | "danger";
  className?: string;
};

export function MetricCard({ label, value, delta, tone = "neutral", className = "" }: MetricCardProps) {
  return (
    <Panel className={`metric-card-panel ${className}`.trim()}>
      <div className="metric-card" data-tone={tone}>
        <div className="metric-card__label">{label}</div>
        <div className="metric-card__value">{value}</div>
        {delta && <div className="metric-card__delta">{delta}</div>}
      </div>
    </Panel>
  );
}
