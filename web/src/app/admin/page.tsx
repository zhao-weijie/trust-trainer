"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { Check, ExternalLink, ImagePlus, Save, ShieldX, WandSparkles, X } from "lucide-react";
import {
  AnalyticsPanel,
  BaseContentLayer,
  Button,
  DatasetLabels,
  Panel,
  ResultPanel,
  StatusBadge
} from "@/components";
import { api } from "@/lib/convexApi";
import { normalizeList } from "@/lib/safety";
import type { AnswerChoice, DemoState, ReviewQueueItem, RiskLevel, ScamStatus, ScopeStatus } from "@/lib/types";

const scamStatuses: ScamStatus[] = ["verified_scam", "suspected_scam", "legitimate"];
const scopeStatuses: ScopeStatus[] = ["in_scope_phishing_or_scam", "benign_contrast", "out_of_scope_spam", "reject"];
const riskLevels: RiskLevel[] = ["low", "medium", "high"];

type DraftForm = {
  scenario: string;
  scam_status: ScamStatus;
  scope_status: ScopeStatus;
  threat_type: string;
  risk_level: RiskLevel;
  red_flags: string;
  safest_action: string;
  skill_tags: string;
  explanation: string;
  answer_choices: AnswerChoice[];
  correct_answer: AnswerChoice["id"];
};

function formFromItem(item: ReviewQueueItem): DraftForm {
  return {
    scenario: item.scenario,
    scam_status: item.scam_status,
    scope_status: item.scope_status,
    threat_type: item.threat_type,
    risk_level: item.risk_level,
    red_flags: item.red_flags.join(", "),
    safest_action: item.safest_action,
    skill_tags: item.skill_tags.join(", "),
    explanation: item.explanation,
    answer_choices: item.answer_choices,
    correct_answer: item.correct_answer
  };
}

function validateDraft(form: DraftForm): string[] {
  const errors: string[] = [];
  const redFlags = normalizeList(form.red_flags);
  const skillTags = normalizeList(form.skill_tags);
  const isPublishableScope = form.scope_status !== "out_of_scope_spam" && form.scope_status !== "reject";

  if (!form.scenario.trim()) errors.push("Scenario is required.");
  if (!form.threat_type.trim()) errors.push("Threat type is required.");
  if (!form.safest_action.trim()) errors.push("Safest action is required.");
  if (!form.explanation.trim()) errors.push("Explanation is required.");
  if (form.answer_choices.length !== 4) errors.push("A drill needs exactly four answer choices.");
  if (form.answer_choices.some((choice) => !choice.text.trim())) errors.push("All answer choices need text.");
  if (!form.answer_choices.some((choice) => choice.id === form.correct_answer)) errors.push("Correct answer must match one choice.");
  if (isPublishableScope && form.scam_status !== "legitimate" && redFlags.length === 0) {
    errors.push("In-scope scam drills need at least one red flag.");
  }
  if (isPublishableScope && skillTags.length === 0) errors.push("Publishable drills need at least one skill tag.");
  if (form.scope_status === "out_of_scope_spam" && form.threat_type !== "generic_spam") {
    errors.push("Out-of-scope spam should use threat type generic_spam.");
  }

  return errors;
}

export default function AdminPage() {
  const state = useQuery(api.domain.getDemoState) as DemoState | undefined;
  const seedDemo = useMutation(api.domain.seedDemo);
  const updateDraft = useMutation(api.domain.updateDraft);
  const attachGeneratedAsset = useMutation(api.domain.attachGeneratedAsset);
  const approveDraft = useMutation(api.domain.approveDraft);
  const rejectDraft = useMutation(api.domain.rejectDraft);
  const markOutOfScope = useMutation(api.domain.markOutOfScope);
  const [selectedId, setSelectedId] = useState<string>("");

  const queue = useMemo(
    () =>
      (state?.submissions.filter((item) => item.review_status === "pending_review" || item.review_status === "prefilter") ?? [])
        .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at)),
    [state]
  );
  const selected = queue.find((item) => item.id === selectedId) ?? queue[0] ?? null;

  return (
    <div className="workflow-shell workflow-shell--wide-panel">
      <BaseContentLayer
        title="Review queue"
        kicker="Human approval gate"
        meta={<StatusBadge tone="draft">{queue.length} pending</StatusBadge>}
      >
        <div className="review-list">
          {queue.map((item) => (
            <button
              className="review-row"
              data-active={selected?.id === item.id}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              type="button"
            >
              <span className="review-row__title">{item.scenario}</span>
              <span className="review-row__text">{item.defanged_text}</span>
              <span className="review-row__meta">
                {item.content_type} · {item.scam_status} · {item.review_status}
              </span>
            </button>
          ))}
          {queue.length === 0 && (
            <Panel title="No pending items" eyebrow="Seed or submit">
              <p className="muted">Seed demo data or submit a new case from the phone-facing check flow.</p>
              <Button onClick={() => void seedDemo()} variant="secondary">Seed demo queue</Button>
            </Panel>
          )}
        </div>
      </BaseContentLayer>

      <AnalyticsPanel title="Quiz draft editor" kicker="LLM prefilter is draft">
        {selected ? (
          <DraftEditor
            approveDraft={approveDraft}
            attachGeneratedAsset={attachGeneratedAsset}
            item={selected}
            key={selected.draft_id}
            markOutOfScope={markOutOfScope}
            rejectDraft={rejectDraft}
            updateDraft={updateDraft}
          />
        ) : (
          <Panel title="Waiting for review items" eyebrow="Queue empty">
            <p className="muted">Submit from `/submit` or seed demo data.</p>
          </Panel>
        )}
      </AnalyticsPanel>
    </div>
  );
}

function DraftEditor({
  attachGeneratedAsset,
  approveDraft,
  item,
  markOutOfScope,
  rejectDraft,
  updateDraft
}: {
  attachGeneratedAsset: ReturnType<typeof useMutation>;
  approveDraft: ReturnType<typeof useMutation>;
  item: ReviewQueueItem;
  markOutOfScope: ReturnType<typeof useMutation>;
  rejectDraft: ReturnType<typeof useMutation>;
  updateDraft: ReturnType<typeof useMutation>;
}) {
  const [form, setForm] = useState<DraftForm>(() => formFromItem(item));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [falConfigured, setFalConfigured] = useState<boolean | null>(null);
  const [publishedId, setPublishedId] = useState("");
  const validationErrors = validateDraft(form);
  const blocksPublish = form.scope_status === "out_of_scope_spam" || form.scope_status === "reject" || validationErrors.length > 0;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/fal/generate-drill-image")
      .then((response) => response.json())
      .then((payload: { configured?: boolean }) => {
        if (!cancelled) setFalConfigured(Boolean(payload.configured));
      })
      .catch(() => {
        if (!cancelled) setFalConfigured(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function save(): Promise<boolean> {
    setError("");
    setNotice("");
    const errors = validateDraft(form);
    if (errors.length > 0) {
      setError(errors.join(" "));
      return false;
    }
    setIsSaving(true);
    try {
      await updateDraft({
        draft_id: item.draft_id,
        scenario: form.scenario.trim(),
        scam_status: form.scam_status,
        scope_status: form.scope_status,
        threat_type: form.threat_type.trim(),
        risk_level: form.risk_level,
        red_flags: normalizeList(form.red_flags),
        safest_action: form.safest_action.trim(),
        skill_tags: normalizeList(form.skill_tags),
        explanation: form.explanation.trim(),
        answer_choices: form.answer_choices.map((choice) => ({ ...choice, text: choice.text.trim() })),
        correct_answer: form.correct_answer
      });
      setNotice("Draft saved.");
      return true;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save this draft.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function approve() {
    if (blocksPublish) {
      setError(validationErrors.join(" ") || "Out-of-scope or rejected drafts cannot be published.");
      return;
    }
    const saved = await save();
    if (!saved) return;
    setIsSaving(true);
    try {
      await approveDraft({ draft_id: item.draft_id });
      setPublishedId(`approved-${item.draft_id}`);
      setNotice("Draft approved and published.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not approve this draft.");
    } finally {
      setIsSaving(false);
    }
  }

  async function generateFalImage() {
    if (!falConfigured || isGeneratingImage) return;
    setError("");
    setNotice("");
    setIsGeneratingImage(true);
    try {
      const response = await fetch("/api/fal/generate-drill-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: form.scenario,
          threat_type: form.threat_type,
          safest_action: form.safest_action,
          red_flags: normalizeList(form.red_flags)
        })
      });
      const payload = (await response.json()) as {
        imageUrl?: string;
        requestId?: string;
        prompt?: string;
        error?: string;
      };
      if (!response.ok || !payload.imageUrl || !payload.requestId || !payload.prompt) {
        throw new Error(payload.error || "fal image generation failed.");
      }
      await attachGeneratedAsset({
        draft_id: item.draft_id,
        generated_asset_url: payload.imageUrl,
        generated_asset_request_id: payload.requestId,
        generated_asset_prompt: payload.prompt
      });
      setNotice("fal edited the seed image and attached it to this draft.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not generate fal image.");
    } finally {
      setIsGeneratingImage(false);
    }
  }

  return (
    <>
      <ResultPanel
        title="Redacted artifact"
        statusLabel={item.scope_status}
        redFlags={item.red_flags}
        safestAction={item.safest_action}
      >
        <p className="artifact-inline">{item.defanged_text}</p>
        {item.generated_asset_url && (
          <figure className="generated-asset">
            <img src={item.generated_asset_url} alt="fal-generated synthetic scam interaction artifact" />
            <figcaption>
              fal.ai synthetic drill image
              {item.generated_asset_request_id ? ` · ${item.generated_asset_request_id}` : ""}
            </figcaption>
          </figure>
        )}
      </ResultPanel>

      <Panel title="fal.ai image artifact" eyebrow="Sponsor media step">
        <p className="muted">Edit the seed chat screenshot into a safe synthetic drill artifact. It remains unplayable until admin approval.</p>
        <div className="action-row">
          <Button
            disabled={!falConfigured || isGeneratingImage || blocksPublish}
            onClick={() => void generateFalImage()}
            variant="secondary"
          >
            {isGeneratingImage ? <WandSparkles size={15} /> : <ImagePlus size={15} />}
            {falConfigured === false ? "fal not configured" : isGeneratingImage ? "Editing..." : "Generate fal edit"}
          </Button>
          {item.generated_asset_url && (
            <a className="button button--ghost button--md" href={item.generated_asset_url} rel="noreferrer" target="_blank">
              Open image <ExternalLink size={15} />
            </a>
          )}
        </div>
      </Panel>

      <Panel title="Teaching labels" eyebrow="Admin editable">
        <div className="editor-grid">
          <label className="field">
            Scam status
            <select value={form.scam_status} onChange={(event) => setForm({ ...form, scam_status: event.target.value as ScamStatus })}>
              {scamStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="field">
            Scope status
            <select value={form.scope_status} onChange={(event) => setForm({ ...form, scope_status: event.target.value as ScopeStatus })}>
              {scopeStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="field">
            Threat type
            <input value={form.threat_type} onChange={(event) => setForm({ ...form, threat_type: event.target.value })} />
          </label>
          <label className="field">
            Risk level
            <select value={form.risk_level} onChange={(event) => setForm({ ...form, risk_level: event.target.value as RiskLevel })}>
              {riskLevels.map((risk) => <option key={risk}>{risk}</option>)}
            </select>
          </label>
        </div>
        <DatasetLabels
          scopeStatus={form.scope_status}
          threatType={form.threat_type}
          riskLevel={form.risk_level}
          redFlags={normalizeList(form.red_flags)}
          safestAction={form.safest_action}
          skillTags={normalizeList(form.skill_tags)}
        />
        {validationErrors.length > 0 && (
          <div className="validation-list" aria-label="Validation issues">
            {validationErrors.map((message) => <span key={message}>{message}</span>)}
          </div>
        )}
      </Panel>

      <Panel title="Quiz draft" eyebrow="What should they do next?">
        <label className="field">
          Scenario
          <textarea value={form.scenario} onChange={(event) => setForm({ ...form, scenario: event.target.value })} />
        </label>
        {form.answer_choices.map((choice, index) => (
          <label className="field" key={choice.id}>
            Choice {choice.id}
            <input
              value={choice.text}
              onChange={(event) => {
                const next = [...form.answer_choices];
                next[index] = { ...choice, text: event.target.value };
                setForm({ ...form, answer_choices: next });
              }}
            />
          </label>
        ))}
        <label className="field">
          Correct answer
          <select value={form.correct_answer} onChange={(event) => setForm({ ...form, correct_answer: event.target.value as AnswerChoice["id"] })}>
            {form.answer_choices.map((choice) => <option key={choice.id}>{choice.id}</option>)}
          </select>
        </label>
        <label className="field">
          Red flags
          <input value={form.red_flags} onChange={(event) => setForm({ ...form, red_flags: event.target.value })} />
        </label>
        <label className="field">
          Safest action
          <input value={form.safest_action} onChange={(event) => setForm({ ...form, safest_action: event.target.value })} />
        </label>
        <label className="field">
          Skill tags
          <input value={form.skill_tags} onChange={(event) => setForm({ ...form, skill_tags: event.target.value })} />
        </label>
        <label className="field">
          Explanation
          <textarea value={form.explanation} onChange={(event) => setForm({ ...form, explanation: event.target.value })} />
        </label>
      </Panel>

      <div className="action-row">
        <Button onClick={() => void approve()} disabled={blocksPublish || isSaving}>
          <Check size={15} /> Approve & publish
        </Button>
        <Button onClick={() => void save()} disabled={validationErrors.length > 0 || isSaving} variant="secondary">
          <Save size={15} /> {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button
          onClick={() => void markOutOfScope({ draft_id: item.draft_id, reason: "Admin marked outside phishing/scam scope." })}
          disabled={isSaving}
          variant="ghost"
        >
          <ShieldX size={15} /> Out of scope
        </Button>
        <Button onClick={() => void rejectDraft({ draft_id: item.draft_id, reason: "Admin rejected draft." })} disabled={isSaving} variant="danger">
          <X size={15} /> Reject
        </Button>
        <Link className="button button--ghost button--md" href="/dashboard">
          Dashboard <ExternalLink size={15} />
        </Link>
        {publishedId && (
          <Link className="button button--primary button--md" href={`/challenge/${publishedId}`}>
            Play published drill <ExternalLink size={15} />
          </Link>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      {notice && <p className="form-notice">{notice}</p>}
    </>
  );
}
