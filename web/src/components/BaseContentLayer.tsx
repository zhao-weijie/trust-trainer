import type { ReactNode } from "react";

export type BaseContentLayerProps = {
  children: ReactNode;
  title: string;
  kicker?: string;
  meta?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function BaseContentLayer({ children, title, kicker, meta, footer, className = "" }: BaseContentLayerProps) {
  return (
    <section className={`base-content-layer ${className}`.trim()}>
      <header className="base-content-layer__header">
        <div>
          {kicker && <div className="kicker">{kicker}</div>}
          <h1 className="base-content-layer__title">{title}</h1>
        </div>
        {meta && <div className="base-content-layer__meta">{meta}</div>}
      </header>
      <div className="base-content-layer__artifact">{children}</div>
      {footer && <footer className="base-content-layer__footer">{footer}</footer>}
    </section>
  );
}
