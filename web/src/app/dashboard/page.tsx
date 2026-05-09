"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { Database, RotateCcw } from "lucide-react";
import { AnalyticsPanel, BaseContentLayer, Button, DatasetLabels, MetricCard, Panel, StatusBadge } from "@/components";
import { api } from "@/lib/convexApi";
import type { DemoState } from "@/lib/types";

export default function DashboardPage() {
  const state = useQuery(api.domain.getDemoState) as DemoState | undefined;
  const stats = useQuery(api.domain.dashboardStats) as
    | {
        submissions: number;
        pendingReview: number;
        approvedDrills: number;
        datasetRows: number;
        attempts: number;
        accuracy: number;
        skillMisses: Record<string, number>;
      }
    | undefined;
  const seedDemo = useMutation(api.domain.seedDemo);
  const resetDemo = useMutation(api.domain.resetDemo);
  const weakSkills = Object.entries(stats?.skillMisses ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="workflow-shell workflow-shell--wide-panel">
      <BaseContentLayer
        title="Skill and dataset dashboard"
        kicker="Reviewed rows, not raw spam"
        meta={<StatusBadge tone="success">{stats?.approvedDrills ?? 0} approved drills</StatusBadge>}
      >
        <div className="dashboard-grid">
          <MetricCard label="Submissions" value={stats?.submissions ?? 0} />
          <MetricCard label="Pending review" value={stats?.pendingReview ?? 0} />
          <MetricCard label="Attempts" value={stats?.attempts ?? 0} />
          <MetricCard label="Accuracy" value={`${stats?.accuracy ?? 0}%`} tone="success" />
        </div>

        <Panel title="Question pool" eyebrow="Approved only">
          <div className="review-list compact">
            {(state?.approvedDrills ?? []).slice(0, 8).map((drill) => (
              <Link className="review-row" href={`/challenge/${drill.id}`} key={drill.id}>
                <span className="review-row__title">{drill.scenario}</span>
                <span className="review-row__meta">{drill.threat_type} · {drill.risk_level} · {drill.scope_status}</span>
              </Link>
            ))}
          </div>
        </Panel>
      </BaseContentLayer>

      <AnalyticsPanel title="Training signals" kicker="Family progress">
        <Panel title="Missed skills" eyebrow="Adaptive demo signal">
          {weakSkills.length ? (
            <div className="tag-list">
              {weakSkills.map(([tag, count]) => <span className="sample-chip" key={tag}>{tag}: {count}</span>)}
            </div>
          ) : (
            <p className="muted">No missed skills yet. Play a challenge and choose a risky action.</p>
          )}
        </Panel>

        <Panel title="Latest dataset rows" eyebrow="Teaching labels">
          {(state?.datasetRows ?? []).slice(0, 3).map((row) => (
            <DatasetLabels
              className="mt-compact"
              key={row.id}
              scopeStatus={row.scope_status}
              threatType={row.threat_type}
              riskLevel={row.risk_level}
              redFlags={row.red_flags}
              safestAction={row.safest_action}
              skillTags={row.skill_tags}
            />
          ))}
        </Panel>

        <Panel title="Demo controls" eyebrow="Shared Convex state">
          <div className="action-row">
            <Button onClick={() => void seedDemo()} variant="secondary">
              <Database size={15} /> Seed
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
