"use client";

export type SegmentOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SegmentedControlProps = {
  options: SegmentOption[];
  value: string;
  onValueChange?: (value: string) => void;
  ariaLabel: string;
  className?: string;
};

export function SegmentedControl({ options, value, onValueChange, ariaLabel, className = "" }: SegmentedControlProps) {
  return (
    <div aria-label={ariaLabel} className={`segmented-control ${className}`.trim()} role="tablist">
      {options.map((option) => (
        <button
          aria-selected={option.value === value}
          className="segmented-control__item"
          data-active={option.value === value}
          disabled={option.disabled}
          key={option.value}
          onClick={() => onValueChange?.(option.value)}
          role="tab"
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
