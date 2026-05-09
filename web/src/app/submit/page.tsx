"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { ArrowRight, Shield, ShieldCheck } from "lucide-react";
import { AnalyticsPanel, BaseContentLayer, Button, Panel, ResultPanel, StatusBadge } from "@/components";
import { api } from "@/lib/convexApi";
import { sanitizeSubmission } from "@/lib/safety";
import { openingExample, seedExamples } from "@/lib/seeds";
import type { ContentType, Submission } from "@/lib/types";

function toneForStatus(status: string) {
  if (status === "legitimate" || status === "benign_contrast") return "success" as const;
  if (status === "verified_scam" || status === "high") return "danger" as const;
  if (status === "suspected_scam" || status === "medium") return "warning" as const;
  return "draft" as const;
}

export default function SubmitPage() {
  const [rawText, setRawText] = useState("");
  const [contentType, setContentType] = useState<ContentType>("sms");
  const [result, setResult] = useState<Submission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submitContent = useMutation(api.domain.submitContent);
  const sanitized = useMemo(() => sanitizeSubmission(rawText), [rawText]);
  const canSubmit = rawText.trim().length > 0 && sanitized.defanged_text.trim().length > 0;
  const hasInput = rawText.trim().length > 0;

  async function submit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError("");
    try {
      const response = (await submitContent({ raw_text: rawText, content_type: contentType })) as {
        submission: Submission;
      };
      setResult(response.submission);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Analysis failed. Try again with text content.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="workflow-shell">
      <BaseContentLayer
        title={hasInput ? "Safety check preview" : "Start your safety check"}
        kicker={hasInput ? "Redacted artifact" : "Scam Check"}
        meta={
          <>
            <StatusBadge tone="info">{contentType}</StatusBadge>
            <StatusBadge tone={hasInput ? "success" : "draft"}>{hasInput ? "PII masked" : "Text first"}</StatusBadge>
          </>
        }
        footer={hasInput ? "PII is masked and suspicious URLs are defanged before display." : undefined}
      >
        {hasInput ? (
          <div className="artifact-preview artifact-preview--phone">
            <div className="artifact-preview__meta">Safe artifact preview</div>
            <p>{sanitized.defanged_text}</p>
          </div>
        ) : (
          <div className="intake-empty">
            <div className="intake-empty__icon" aria-hidden="true">
              <Shield size={72} strokeWidth={1.7} />
            </div>
            <h2>Start Your Safety Check</h2>
            <p>Paste a suspicious message and turn it into a quick safety check.</p>
          </div>
        )}
      </BaseContentLayer>

      <AnalyticsPanel title={hasInput ? "Ready to check" : "Check a message"} kicker="Step 01">
        <Panel title="Paste or seed content" eyebrow="Input">
          <label className="field">
            Source type
            <select value={contentType} onChange={(event) => setContentType(event.target.value as ContentType)}>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="url">URL</option>
              <option value="social_post">Social post</option>
            </select>
          </label>
          <label className="field">
            Suspicious content
            <textarea
              id="suspicious-content"
              placeholder={openingExample.raw_text}
              value={rawText}
              onChange={(event) => {
                setRawText(event.target.value);
                setResult(null);
                setError("");
              }}
            />
          </label>
          <div className="sample-grid">
            {seedExamples.slice(0, 4).map((example) => (
              <button
                className="sample-chip"
                key={example.id}
                onClick={() => {
                  setRawText(example.raw_text);
                  setContentType(example.content_type);
                  setResult(null);
                }}
                type="button"
              >
                {example.threat_type}
              </button>
            ))}
          </div>

          <div className="status-stack">
            <StatusBadge tone={hasInput ? "success" : "draft"}>PII masked locally</StatusBadge>
            <StatusBadge tone={hasInput ? "success" : "draft"}>URLs defanged before display</StatusBadge>
          </div>
          {error && <p className="form-error">{error}</p>}
          <Button disabled={!canSubmit || isSubmitting} onClick={() => void submit()}>
            {isSubmitting ? "Submitting..." : "Submit for analysis"} <ShieldCheck size={15} />
          </Button>
        </Panel>

        {result ? (
          <ResultPanel
            title="Safety result"
            statusLabel={result.scam_status}
            statusTone={toneForStatus(result.scam_status)}
            description={
              result.scope_status === "out_of_scope_spam"
                ? "This is advertising or generic spam, not phishing training material."
                : "Use this safety check to spot the risk, then practice the same habit in a reviewed drill."
            }
            redFlags={result.red_flags}
            safestAction={result.safest_action}
            meta={
              <div className="status-stack">
                <StatusBadge tone={toneForStatus(result.scope_status)}>{result.scope_status}</StatusBadge>
                <StatusBadge tone={toneForStatus(result.risk_level)}>{result.risk_level}</StatusBadge>
              </div>
            }
          >
            {result.skeptical_claims.length > 0 && (
              <p className="muted">Caution notes: {result.skeptical_claims.join(" ")}</p>
            )}
            <Link className="button button--primary button--md" href="/challenge/approved-draft-seed-government-grant">
              Try a safety drill <ArrowRight size={15} />
            </Link>
          </ResultPanel>
        ) : null}
      </AnalyticsPanel>
    </div>
  );
}
