export type DatasetLabelsProps = {
  scopeStatus: string;
  threatType: string;
  riskLevel: string;
  redFlags: string[];
  safestAction: string;
  skillTags: string[];
  className?: string;
};

const rows = [
  ["scope_status", "scopeStatus"],
  ["threat_type", "threatType"],
  ["risk_level", "riskLevel"],
  ["red_flags", "redFlags"],
  ["safest_action", "safestAction"],
  ["skill_tags", "skillTags"]
] as const;

export function DatasetLabels(props: DatasetLabelsProps) {
  return (
    <dl className={`dataset-labels ${props.className ?? ""}`.trim()}>
      {rows.map(([label, key]) => {
        const value = props[key];

        return (
          <div className="dataset-labels__row" key={label}>
            <dt className="dataset-labels__key">{label}</dt>
            <dd className="dataset-labels__value">{Array.isArray(value) ? value.join(", ") : value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
