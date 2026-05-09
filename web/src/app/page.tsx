"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { ArrowRight, Database, RotateCcw } from "lucide-react";
import { AnalyticsPanel, Button, MetricCard, Panel, StatusBadge } from "@/components";
import { api } from "@/lib/convexApi";
import type { DemoState } from "@/lib/types";

export default function HomePage() {
  const state = useQuery(api.domain.getDemoState) as DemoState | undefined;
  const seedDemo = useMutation(api.domain.seedDemo);
  const resetDemo = useMutation(api.domain.resetDemo);

  const pending = state?.submissions.filter((item) => item.review_status === "pending_review").length ?? 0;
  const approved = state?.approvedDrills.length ?? 0;
  const attempts = state?.attempts.length ?? 0;
  const rows = state?.datasetRows.length ?? 0;
  const firstDrill = state?.approvedDrills[0]?.id ?? "approved-draft-seed-government-grant";

  return (
    <div className="workflow-shell workflow-shell--wide-panel">
      <section className="base-content-layer">
        <header className="base-content-layer__header">
          <div>
            <div className="kicker">Demo loop</div>
            <h1 className="base-content-layer__title">Trust Trainer turns suspicious content into reviewed drills.</h1>
          </div>
          <StatusBadge tone="draft">Convex shared state</StatusBadge>
        </header>

        <div className="base-content-layer__artifact home-artifact">
          <div className="flow-list">
            {[
              "Paste suspicious SMS, email, link, WhatsApp, or social content.",
              "Mask obvious PII and defang suspicious URLs before analysis.",
              "Show a cautious safety result, then send the case to review.",
              "Approve a human-reviewed quiz draft into the family drill pool.",
              "Answer the drill on a phone and update skill/dashboard metrics."
            ].map((step, index) => (
              <div className="flow-item" key={step}>
                <span className="flow-item__number">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnalyticsPanel
        title="Run the judged path"
        kicker="No marketing page"
        actions={
          <>
            <Link className="button button--primary button--md" href="/submit">
              Start check <ArrowRight size={15} />
            </Link>
            <Link className="button button--ghost button--md" href={`/challenge/${firstDrill}`}>
              Play fallback drill
            </Link>
          </>
        }
      >
        <div className="metric-grid">
          <MetricCard label="Pending review" value={pending} />
          <MetricCard label="Playable drills" value={approved} tone="success" />
          <MetricCard label="Attempts" value={attempts} />
          <MetricCard label="Dataset rows" value={rows} />
        </div>

        <Panel title="Backend controls" eyebrow="Demo data">
          <p className="muted">
            Seed deterministic examples before a demo. Reset clears shared Convex state for everyone using this deployment.
          </p>
          <div className="action-row">
            <Button onClick={() => void seedDemo()} variant="secondary">
              <Database size={15} /> Seed demo
            </Button>
            <Button onClick={() => void resetDemo()} variant="ghost">
              <RotateCcw size={15} /> Reset
            </Button>
          </div>
        </Panel>
      </AnalyticsPanel>
    </div>
  );
}
