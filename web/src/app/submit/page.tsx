"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { ArrowRight, ClipboardPaste, ShieldCheck } from "lucide-react";
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
  const [rawText, setRawText] = useState(openingExample.raw_text);
  const [contentType, setContentType] = useState<ContentType>("sms");
  const [result, setResult] = useState<Submission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitContent = useMutation(api.domain.submitContent);
  const sanitized = useMemo(() => sanitizeSubmission(rawText), [rawText]);
  const canSubmit = rawText.trim().length > 0 && sanitized.defanged_text.trim().length > 0;

  async function submit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const response = (await submitContent({ raw_text: rawText, content_type: contentType })) as {
        submission: Submission;
      };
      setResult(response.submission);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="workflow-shell">
      <BaseContentLayer
        title="Check suspicious content"
        kicker="Suspected content forwarder"
        meta={
          <>
            <StatusBadge tone="info">{contentType}</StatusBadge>
            <StatusBadge tone="draft">Browser-side redaction preview</StatusBadge>
          </>
        }
        footer="The textarea is the user's local input. The analyzed artifact below is redacted and URL-defanged first."
      >
        <div className="artifact-preview">
          <div className="artifact-preview__meta">Redacted artifact preview</div>
          <p>{sanitized.defanged_text || "Paste suspicious content to preview the safe artifact."}</p>
        </div>
      </BaseContentLayer>

      <AnalyticsPanel title="Analysis readiness" kicker="Step 01">
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
            <textarea value={rawText} onChange={(event) => setRawText(event.target.value)} />
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
        </Panel>

        <Panel title="Privacy verification" eyebrow="Before analysis">
          <div className="status-stack">
            <StatusBadge tone="success">PII masked locally</StatusBadge>
            <StatusBadge tone="success">URLs defanged before display</StatusBadge>
          </div>
          <p className="muted">Emails, phone numbers, account-like identifiers, addresses, and simple names are masked.</p>
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
                : "This deterministic prefilter is draft material until a human reviewer approves it."
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
            <Link className="button button--primary button--md" href="/admin">
              Send to human review <ArrowRight size={15} />
            </Link>
          </ResultPanel>
        ) : (
          <Panel title="Human review" eyebrow="Next step">
            <p className="muted">A submitted case creates a review queue item and draft quiz. Nothing becomes playable until admin approval.</p>
            <Button onClick={() => void navigator.clipboard?.writeText(sanitized.defanged_text)} variant="ghost">
              <ClipboardPaste size={15} /> Copy safe preview
            </Button>
          </Panel>
        )}
      </AnalyticsPanel>
    </div>
  );
}
