import type { ReactNode } from "react";

export type AnalyticsPanelProps = {
  children: ReactNode;
  title: string;
  kicker?: string;
  actions?: ReactNode;
  className?: string;
};

export function AnalyticsPanel({ children, title, kicker, actions, className = "" }: AnalyticsPanelProps) {
  return (
    <aside className={`analytics-panel ${className}`.trim()}>
      <header className="analytics-panel__header">
        {kicker && <div className="kicker">{kicker}</div>}
        <h2 className="analytics-panel__title">{title}</h2>
        {actions && <div className="analytics-panel__actions">{actions}</div>}
      </header>
      {children}
    </aside>
  );
}
