import type { ReactNode } from "react";

export type PanelProps = {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
};

export function Panel({ children, title, eyebrow, action, className = "" }: PanelProps) {
  return (
    <section className={`panel ${className}`.trim()}>
      {(title || eyebrow || action) && (
        <header className="panel__header">
          <div>
            {eyebrow && <div className="panel__eyebrow">{eyebrow}</div>}
            {title && <h2 className="panel__title">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      <div className="panel__body">{children}</div>
    </section>
  );
}
