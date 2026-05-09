"use client";

import type { ReactNode } from "react";

export type DrillOption = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  feedback?: ReactNode;
  disabled?: boolean;
};

export type DrillOptionsProps = {
  options: DrillOption[];
  selectedId?: string;
  correctId?: string;
  revealAnswer?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
};

export function DrillOptions({
  options,
  selectedId,
  correctId,
  revealAnswer = false,
  onSelect,
  className = ""
}: DrillOptionsProps) {
  return (
    <div className={`drill-options ${className}`.trim()}>
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        const result =
          revealAnswer && option.id === correctId ? "correct" : revealAnswer && isSelected ? "incorrect" : undefined;

        return (
          <button
            className="drill-option"
            data-result={result}
            data-selected={isSelected}
            disabled={option.disabled}
            key={option.id}
            onClick={() => onSelect?.(option.id)}
            type="button"
          >
            <span className="drill-option__label">
              <span className="drill-option__id">{option.id}</span>
              <span>{option.label}</span>
            </span>
            {option.description && <span className="drill-option__description">{option.description}</span>}
            {revealAnswer && option.feedback && <span className="drill-option__feedback">{option.feedback}</span>}
          </button>
        );
      })}
    </div>
  );
}
