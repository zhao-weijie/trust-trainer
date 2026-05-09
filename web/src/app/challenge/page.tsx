"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { ClipboardCheck } from "lucide-react";
import { AnalyticsPanel, BaseContentLayer, StatusBadge } from "@/components";
import { api } from "@/lib/convexApi";
import type { DemoState } from "@/lib/types";
import { ChallengeClient } from "./[id]/ChallengeClient";

export default function DefaultChallengePage() {
  const state = useQuery(api.domain.getDemoState) as DemoState | undefined;
  const latestApprovedDrill = useMemo(
    () => [...(state?.approvedDrills ?? [])].sort((a, b) => b.published_at.localeCompare(a.published_at))[0] ?? null,
    [state?.approvedDrills]
  );

  if (state === undefined) {
    return <div className="workflow-shell"><BaseContentLayer title="Loading drill" kicker="Challenge"><p>Loading...</p></BaseContentLayer></div>;
  }

  if (!latestApprovedDrill) {
    return (
      <div className="workflow-shell">
        <BaseContentLayer title="No approved drill yet" kicker="Human review required">
          <p>Approve a saved case before it becomes the default family drill.</p>
        </BaseContentLayer>
        <AnalyticsPanel title="Next step" kicker="Review queue">
          <Link className="button button--primary button--md" href="/admin">
            <ClipboardCheck size={15} /> Open human review
          </Link>
        </AnalyticsPanel>
      </div>
    );
  }

  return <ChallengeClient id={latestApprovedDrill.id} />;
}
