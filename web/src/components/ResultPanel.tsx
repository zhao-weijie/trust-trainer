import type { ReactNode } from "react";
import { Panel } from "./Panel";
import { StatusBadge, type StatusBadgeTone } from "./StatusBadge";

export type ResultPanelProps = {
  title: string;
  statusLabel: string;
  statusTone?: StatusBadgeTone;
  description?: string;
  redFlags?: string[];
  safestAction?: string;
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function ResultPanel({
  title,
  statusLabel,
  statusTone = "draft",
  description,
  redFlags = [],
  safestAction,
  meta,
  children,
  className = ""
}: ResultPanelProps) {
  return (
    <Panel className={`result-panel ${className}`.trim()}>
      <div className="result-panel__summary">
        <h3 className="result-panel__title">
          <span>{title}</span>
          <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
        </h3>
        {description && <p className="result-panel__description">{description}</p>}
      </div>

      {redFlags.length > 0 && (
        <ul className="result-panel__list" aria-label="Red flags">
          {redFlags.map((flag) => (
            <li key={flag}>{flag}</li>
          ))}
        </ul>
      )}

      {safestAction && (
        <p className="result-panel__safest-action">
          <strong>Safest action:</strong> {safestAction}
        </p>
      )}

      {meta}
      {children}
    </Panel>
  );
}
