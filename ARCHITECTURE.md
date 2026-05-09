# Trust Trainer Architecture

Source of truth: [hackathon-brief.md](hackathon-brief.md).
Product stories: [STORIES.yaml](STORIES.yaml).
Design system: [.planning/DESIGN.md](.planning/DESIGN.md).
Public demo: [https://web-one-rho-kt48p1kwl2.vercel.app](https://web-one-rho-kt48p1kwl2.vercel.app).

## Product Loop

Trust Trainer is not a generic quiz app and not a truth checker. The core loop is:

```text
suspicious content
-> browser-side PII redaction and URL defanging
-> instant scam/safety check
-> human admin review
-> approved family drill
-> attempt feedback
-> skill and dataset dashboard
```

The first user-facing result is a safety check. The drill exists only after review.

## Scope Rules

In scope:

- Phishing, smishing, impersonation, credential theft, payment theft, harmful scams, malicious links.
- Legitimate contrast examples that teach skepticism without paranoia.
- Misleading provenance examples when the lesson is safest next action, not truth arbitration.

Out of scope:

- Generic spam, advertising, nuisance messages, broad fact checking, and AI-detector certainty claims.
- Browser extensions, WhatsApp automation, production auth, notifications, public sharing, real model retraining.

Hard rules:

- Do not treat `spam` as equivalent to `phishing`.
- Defang suspicious URLs before display: `hxxps://example[.]com/login`.
- AI output is draft material until a human admin approves it.
- `verified_scam` requires a reviewed seed/source/admin-confirmed pattern.
- LLM-only harmful-looking results should normally be `suspected_scam`.

## Status Enums

```ts
type ScamStatus = "verified_scam" | "suspected_scam" | "legitimate";

type ScopeStatus =
  | "in_scope_phishing_or_scam"
  | "benign_contrast"
  | "out_of_scope_spam"
  | "reject";

type RiskLevel = "low" | "medium" | "high";

type ReviewStatus =
  | "prefilter"
  | "pending_review"
  | "approved"
  | "rejected"
  | "out_of_scope";
```

## Core Contracts

The code contract lives in [web/src/lib/types.ts](web/src/lib/types.ts). These are the durable product objects.

### `SubmissionArtifact`

Raw intake metadata plus the original content. This object must not be sent to external AI before redaction.

```ts
type SubmissionArtifact = {
  id: string;
  submitted_at: string;
  content_type: "email" | "sms" | "whatsapp" | "url" | "social_post" | "screenshot";
  source_kind: "user_submission" | "synthetic_seed" | "public_dataset" | "provenance_pack";
  source_dataset: string;
  original_label: string;
  raw_text: string;
  raw_asset_url?: string;
};
```

### `RedactionResult`

Browser-side safety transform result. This is what external analysis and UI display should use.

```ts
type RedactionResult = {
  pii_redacted_text: string;
  defanged_text: string;
  redaction_notice_shown: boolean;
  redaction_method: "browser_regex_demo" | "privacy_filter" | "manual_admin";
};
```

### `TeachingLabels`

Every seed, scam check, draft, approved drill, and exported dataset row needs these labels.

```ts
type TeachingLabels = {
  scam_status: ScamStatus;
  scope_status: ScopeStatus;
  threat_type: string;
  risk_level: RiskLevel;
  red_flags: string[];
  safest_action: string;
  skeptical_claims: string[];
  skill_tags: string[];
};
```

### `ScamCheck`

Instant result shown to the submitter and draft input for admin review.

```ts
type ScamCheck = TeachingLabels & {
  id: string;
  submission_id: string;
  checked_at: string;
  check_source: "heuristic_demo" | "llm_prefilter" | "reviewed_seed_match";
  review_status: "prefilter" | "admin_confirmed" | "admin_corrected";
};
```

### `DrillDraft`

Editable admin object. This can be generated from a seed, heuristic, or model, but it is not playable yet.

```ts
type DrillDraft = TeachingLabels & {
  id: string;
  submission_id: string;
  scam_check_id: string;
  review_status: ReviewStatus;
  draft_source: "seed" | "heuristic_demo" | "llm_prefilter" | "admin";
  scenario: string;
  answer_choices: { id: "A" | "B" | "C" | "D"; text: string }[];
  correct_answer: "A" | "B" | "C" | "D";
  explanation: string;
};
```

### `ApprovedDrill`

Playable question pool item. Only approved drills can appear in `/challenge/[id]`.

```ts
type ApprovedDrill = TeachingLabels & {
  id: string;
  draft_id: string;
  submission_id: string;
  content_type: ContentType;
  source_dataset: string;
  original_label: string;
  published_at: string;
  scenario: string;
  answer_choices: AnswerChoice[];
  correct_answer: AnswerChoiceId;
  explanation: string;
};
```

### `Attempt`

Learner interaction used for immediate feedback and skill dashboard metrics.

```ts
type Attempt = {
  id: string;
  drill_id: string;
  selected_answer: AnswerChoiceId;
  is_correct: boolean;
  missed_skill_tags: string[];
  created_at: string;
};
```

### `DatasetRow`

The reviewed dataset artifact. This is the product moat; raw public data is only bootstrapping material.

```ts
type DatasetRow = TeachingLabels & {
  id: string;
  submission_id: string;
  approved_drill_id: string;
  content_type: ContentType;
  source_dataset: string;
  original_label: string;
  review_status: "admin_approved";
  scenario: string;
  answer_choices: AnswerChoice[];
  correct_answer: AnswerChoiceId;
  explanation: string;
};
```

### `ReviewQueueItem`

Hackathon UI aggregate for local demo state. It joins artifact, redaction result, labels, and draft fields so the admin screen can edit one object. Do not treat it as the normalized backend schema.

```ts
type ReviewQueueItem = SubmissionArtifact &
  RedactionResult &
  DrillPrompt & {
    review_status: ReviewStatus;
    scam_check_id: string;
    draft_id: string;
  };
```

## Data Flow

```text
SubmitPage
  raw text
  -> sanitizeSubmission()
  -> heuristicCheck() or model adapter
  -> Convex submissions, scamChecks, and drillDrafts

AdminPage
  Convex ReviewQueueItem projection
  -> admin edits labels, scenario, choices, explanation
  -> approve / reject / out_of_scope

approveDraft()
  approved ReviewQueueItem
  -> ApprovedDrill
  -> DatasetRow

ChallengePage
  ApprovedDrill
  -> Attempt
  -> immediate feedback and missed_skill_tags

DashboardPage
  ApprovedDrill[] + Attempt[] + DatasetRow[]
  -> question pool count, accuracy, weak skills, reviewed row growth
```

## AI JSON Contracts

External model output must fit strict JSON and be repaired or rejected if it does not.

### Scam Check

```json
{
  "scam_status": "suspected_scam",
  "scope_status": "in_scope_phishing_or_scam",
  "threat_type": "payment_theft",
  "risk_level": "high",
  "red_flags": ["small unexpected payment", "urgent delivery pressure", "unfamiliar defanged link"],
  "safest_action": "Open the official delivery app or website directly.",
  "skeptical_claims": [],
  "skill_tags": ["urgency_trap", "link_inspection", "official_source_check"]
}
```

For `legitimate`, keep `red_flags` empty or low confidence and use `skeptical_claims` for cautious notes.

### Drill Draft

```json
{
  "scenario": "A bank alert claims there was a new login and asks you to verify through a link.",
  "scope_status": "in_scope_phishing_or_scam",
  "threat_type": "credential_theft",
  "risk_level": "high",
  "red_flags": ["account suspension threat", "unfamiliar login link"],
  "safest_action": "Open the bank app directly or call the number on your card.",
  "skill_tags": ["credential_safety", "link_inspection", "official_source_check"],
  "answer_choices": [
    { "id": "A", "text": "Click the link quickly before the deadline." },
    { "id": "B", "text": "Open the official app or website directly." },
    { "id": "C", "text": "Reply and ask whether the message is real." },
    { "id": "D", "text": "Forward it to family so they can decide." }
  ],
  "correct_answer": "B",
  "explanation": "Real bank alerts should be checked through the bank app or known phone number, not a message link."
}
```

## Seed Data Policy

Use deterministic seeds for the demo path:

- Synthetic SMS/WhatsApp scams for family-facing examples.
- Figshare-derived phishing email patterns for verified scam seeds.
- PhiUSIIL-derived URL patterns for link inspection and benign contrast.
- Exa/provenance pack examples only when source metadata is stored and admin-reviewed.

Do not keep large raw public datasets in the repo. Import scripts may read local/raw files during preparation, but committed/demo data should be small, redacted, defanged, and already normalized into `SeedExample` or `DatasetRow` contracts.

## Current Implementation

```text
web/src/lib/types.ts       # canonical TypeScript contracts
web/src/lib/seeds.ts       # deterministic normalized seed examples
web/src/lib/safety.ts      # demo redaction, URL defanging, heuristic labels
web/convex/schema.ts       # Convex tables for submissions, checks, drafts, drills, attempts, dataset rows
web/convex/domain.ts       # Convex queries/mutations for the full demo lifecycle
web/src/app/submit         # instant check
web/src/app/admin          # human review and publish
web/src/app/challenge/[id] # playable drill
web/src/app/dashboard      # skill and dataset loop
```

The current app uses Convex shared state and deterministic heuristics. Add live AI APIs only behind adapters that return the same contracts. The public Vercel route is:

```text
https://web-one-rho-kt48p1kwl2.vercel.app
```

Convex dev deployment:

```text
NEXT_PUBLIC_CONVEX_URL=https://fleet-curlew-675.convex.cloud
```

## Build Priorities

1. Keep the visible demo path smooth: submit -> result -> admin -> approve -> challenge -> dashboard.
2. Keep contracts strict and small.
3. Keep Convex persistence contract-compatible with `web/src/lib/types.ts`.
4. Add OpenAI, Exa, fal.ai, Gemini, or Adaption only when their output is visible in the same review loop.
5. Record a fallback demo using deterministic seed data.

## Cut List

Do not build these unless the hackathon scope is explicitly changed:

- Browser extension.
- Automatic WhatsApp delivery.
- Production auth.
- Notifications.
- Public sharing of user-submitted content.
- Real retraining.
- Broad fact checking.
- AI image/video truth detection.
- Live malicious URL browsing.
