"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { BarChart3 } from "lucide-react";
import { useState } from "react";
import { AnalyticsPanel, BaseContentLayer, DrillOptions, ResultPanel, StatusBadge } from "@/components";
import { api } from "@/lib/convexApi";
import type { AnswerChoice, ApprovedDrill, Attempt } from "@/lib/types";

export function ChallengeClient({ id }: { id: string }) {
  const drill = useQuery(api.domain.getApprovedDrill, { id }) as ApprovedDrill | null | undefined;
  const recordAttempt = useMutation(api.domain.recordAttempt);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [selected, setSelected] = useState<AnswerChoice["id"] | null>(null);
  const [error, setError] = useState("");

  async function answer(choiceId: string) {
    if (!drill || attempt) return;
    setSelected(choiceId as AnswerChoice["id"]);
    setError("");
    try {
      const nextAttempt = (await recordAttempt({ drill_id: drill.id, selected_answer: choiceId as AnswerChoice["id"] })) as Attempt;
      setAttempt(nextAttempt);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not record this attempt.");
    }
  }

  if (drill === undefined) {
    return <div className="workflow-shell"><BaseContentLayer title="Loading drill" kicker="Challenge"><p>Loading...</p></BaseContentLayer></div>;
  }

  if (!drill) {
    return (
      <div className="workflow-shell">
        <BaseContentLayer title="Drill unavailable" kicker="Approved only">
          <p>This drill is not approved or does not exist.</p>
        </BaseContentLayer>
        <AnalyticsPanel title="Next step" kicker="Fallback">
          <Link className="button button--primary button--md" href="/dashboard">Open dashboard</Link>
        </AnalyticsPanel>
      </div>
    );
  }

  return (
    <div className="workflow-shell">
      <BaseContentLayer
        title="Safety drill"
        kicker="Family safety drill"
        meta={
          <>
            <StatusBadge tone="warning">{drill.risk_level}</StatusBadge>
            <StatusBadge tone="draft">{drill.threat_type}</StatusBadge>
          </>
        }
      >
        <div className="challenge-artifact">
          <div className="artifact-preview__meta">{drill.content_type} scenario</div>
          <p className="challenge-artifact__scenario">{drill.scenario}</p>
          {attempt && (
            <div className="challenge-artifact__result">
              <StatusBadge tone={attempt.is_correct ? "success" : "danger"}>
                {attempt.is_correct ? "Correct action" : "Risky choice"}
              </StatusBadge>
              <span>{drill.safest_action}</span>
            </div>
          )}
        </div>
      </BaseContentLayer>

      <AnalyticsPanel title="Choose the safest action" kicker="One tap answer">
        <div className="drill-progress">
          <span>Question</span>
          <strong>01</strong>
        </div>
        <DrillOptions
          correctId={drill.correct_answer}
          onSelect={(choiceId) => void answer(choiceId)}
          options={drill.answer_choices.map((choice) => ({
            id: choice.id,
            label: choice.text,
            disabled: Boolean(attempt),
            feedback:
              attempt && choice.id === drill.correct_answer
                ? "Safest action"
                : attempt && choice.id === selected
                  ? `Missed cue: ${drill.red_flags[0] ?? "unsafe channel"}`
                  : undefined
          }))}
          revealAnswer={Boolean(attempt)}
          selectedId={selected ?? undefined}
        />
        {error && <p className="form-error">{error}</p>}

        {attempt ? (
          <ResultPanel
            title={attempt.is_correct ? "Correct action" : "Risky choice"}
            statusLabel={attempt.is_correct ? "correct" : "missed cue"}
            statusTone={attempt.is_correct ? "success" : "danger"}
            description={drill.explanation}
            redFlags={drill.red_flags}
            safestAction={drill.safest_action}
          >
            <div className="tag-list">
              {drill.skill_tags.map((tag) => <span className="sample-chip" key={tag}>{tag}</span>)}
            </div>
            <Link className="button button--primary button--md" href="/dashboard">
              <BarChart3 size={15} /> View dashboard
            </Link>
          </ResultPanel>
        ) : (
          <ResultPanel
            title="Before reveal"
            statusLabel="pending"
            description="Pick the action you would want a family member to take. Feedback appears immediately."
          />
        )}
      </AnalyticsPanel>
    </div>
  );
}
