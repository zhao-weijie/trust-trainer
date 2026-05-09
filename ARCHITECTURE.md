# SecondLook Trainer Architecture And Build Plan

Source of truth: [hackathon-brief.md](hackathon-brief.md).
Product stories: [STORIES.yaml](STORIES.yaml).
Sponsor/tooling decisions: [SPONSOR_TOOLING.md](SPONSOR_TOOLING.md).

## Build Stance

Status: at risk if this becomes either a generic quiz app or a vague AI truth checker. The demo must show one product with three connected experiences:

```text
suspected content -> browser-side PII redaction -> instant SecondLook status -> human review/quiz creator -> published question -> mobile quiz -> skill/dashboard loop
```

Do not spend hackathon time on WhatsApp API approval, browser extensions, production auth, public sharing, real retraining, or generic spam filtering. Those are distractions.

## Demo-Critical User Journeys

1. Instant SecondLook check
   - Mobile-first paste/upload for suspicious SMS, WhatsApp, email, screenshots, links, or posts.
   - Browser masks obvious PII and defangs suspicious URLs before external analysis.
   - UI shows the redacted submission and a notice: "PII was redacted in your browser before analysis."
   - Result is one of `verified_scam`, `suspected_scam`, or `legitimate`.
   - If scam/suspected scam: show red flags and safest next action.
   - If legitimate: show quick skeptical notes about claims or requests, without launching a full verification workflow.

2. Human reviewer and quiz creator
   - Queue shows submitted/seeded items with LLM judge prefilter output.
   - Admin can correct scam status, scope status, threat type, risk level, red flags, safest action, and skill tags.
   - Admin can create or edit a quiz question from the reviewed item.
   - Admin can approve, reject, or mark out-of-scope.

3. Mobile quiz taker
   - Published questions become short "what should you do next?" challenges.
   - User chooses the safest next action.
   - Feedback is immediate.
   - Wrong-answer feedback explains why the tempting choice was risky and what cue was missed.

4. Skill and dataset dashboard
   - Show approved questions, attempts, accuracy, most-missed skills, and cleaned dataset rows.
   - Make the dataset improvement loop visible for judges.

## Hackathon Demo Path

```text
mobile paste/upload
-> browser-side PII redaction + URL defanging
-> redacted submission display
-> suspected_scam / verified_scam / legitimate result
-> admin review queue with LLM judge prefilter
-> quiz draft edit and approval
-> mobile quiz answer
-> feedback explains missed cue
-> dashboard updates skills and reviewed dataset rows
```

The safety drill is not the first response to the submitter. The first response is an instant SecondLook status. The drill is created after reviewer/admin action.

## Recommended Stack

- Frontend: Next.js App Router, TypeScript, Tailwind.
- Backend/data: Convex for live submissions, review queue, attempts, and dashboard state.
- AI: OpenAI Responses API with Structured Outputs for classification and drill generation.
- Privacy: OpenAI Privacy Filter local/open-weight where available, with Presidio/regex fallback before any external API call.
- Provenance search: Exa for retrieving source pages, citations, source images, and current context for real-vs-fake media drills.
- Media understanding/generation: Gemini image understanding and Veo for optional real-vs-synthetic media contrast drills.
- Synthetic multimodal assets: fal.ai for safe fake screenshots or scam-like visual artifacts.
- Dataset labeling/cleaning: Adaption Adaptive Data for offline/admin dataset adaptation, evaluation, and export if sponsor access is available; local deterministic fallback otherwise.
- Provider fallback: OpenRouter, Cloudflare Workers AI, Ollama, and deterministic seed mode behind one model adapter.

If time is tight, build Convex-backed state first and keep all external APIs behind deterministic demo fixtures.

## App Structure

```text
web/
  app/
    page.tsx                  # demo command center
    submit/page.tsx           # content intake
    admin/page.tsx            # human review queue
    challenge/[id]/page.tsx   # playable family drill
    dashboard/page.tsx        # family skills + dataset loop
  components/
    intake/
    review/
    challenge/
    dashboard/
  lib/
    ai/
      modelAdapter.ts
      generateDrill.ts
      schemas.ts
      providers/
        openai.ts
        openrouter.ts
        workersAi.ts
        ollama.ts
        deterministic.ts
        gemini.ts
    provenance/
      exa.ts
      sourcePack.ts
    data/
      datasetAdapter.ts
      providers/
        adaption.ts
        local.ts
    safety/
      defang.ts
      scope.ts
    seeds/
      drills.ts
  convex/
    schema.ts
    submissions.ts
    drills.ts
    attempts.ts
```

## Core Data Model

Every seed and generated drill must carry the teaching labels required by `AGENTS.md`.

### `submissions`

```text
id
createdAt
contentType: email | sms | whatsapp | screenshot | url | social_post | image
source: user_submission | synthetic_seed | figshare | phiusiil | phishtank | kaggle_reviewed
rawText
rawAssetUrl?
defangedText
piiRedactedText
redactionNoticeShown
personalizationProfileId?
status: received | checked | pending_review | approved | rejected
```

### `personalizationProfiles`

Use this only for authenticated or demo-authenticated users. It must never contain PII removed from the submitted content.

```text
id
userId
locale
preferredLanguage
familyRoleLabel
commonChannels: string[]
trustedInstitutionPlaceholders: string[]
riskComfort: cautious | balanced
```

### `scamChecks`

```text
id
submissionId
scam_status: verified_scam | suspected_scam | legitimate
scope_status: in_scope_phishing_or_scam | benign_contrast | out_of_scope_spam | reject
threat_type
risk_level: low | medium | high
red_flags: string[]
safest_action
skeptical_claims: string[]
modelTrace
review_status: prefilter | admin_confirmed | admin_corrected
```

### `drillDrafts`

```text
id
submissionId
scamCheckId
scenario
scope_status: in_scope_phishing_or_scam | benign_contrast | out_of_scope_spam | reject
threat_type
risk_level: low | medium | high
red_flags: string[]
safest_action
skill_tags: string[]
answer_choices: { id, text }[]
correct_answer
explanation
review_status: pending_review | approved | rejected
modelTrace
```

### `approvedDrills`

```text
id
draftId
scenario
contentType
threat_type
risk_level
red_flags
safest_action
skill_tags
answer_choices
correct_answer
explanation
publishedAt
```

### `attempts`

```text
id
drillId
familyId
selectedAnswer
isCorrect
missedSkillTags
createdAt
```

### `datasetRows`

```text
id
submissionId
approvedDrillId
content_type
source_dataset
original_label
scenario
scam_status
threat_type
risk_level
red_flags
safest_action
skill_tags
answer_choices
correct_answer
explanation
review_status
scope_status
```

## Critical Path Fallbacks

The app must run end-to-end with `DEMO_MODE=true` and no external API keys.

| Step | Primary | Fallback |
|---|---|---|
| PII masking | OpenAI Privacy Filter local/open-weight | Presidio, regex, manual admin masking |
| URL defanging | Local deterministic code | None; this is mandatory local code |
| First-pass labels | OpenAI `gpt-5.4-nano` Structured Outputs | OpenRouter, Workers AI, Ollama, deterministic seed labels |
| Drill generation | OpenAI `gpt-5.4-mini` Structured Outputs | OpenRouter, Ollama, cached output |
| Real-image provenance | Exa Search API | curated local source packs |
| Synthetic video contrast | Gemini Veo 3.1 | fal.ai/static generated image |
| State/realtime | Convex | local JSON/SQLite seed mode |
| Uploaded assets | Convex File Storage | Cloudflare R2, local public assets |

## Optional Integrations

These are useful but should not block the demo:

| Step | Tool | Use |
|---|---|---|
| Safety screen | OpenAI `omni-moderation-latest` | Abuse/safety screen before storage/display. |
| Ambiguous escalation | OpenAI `gpt-5.5` | Rare hard examples only. |
| Dataset cleaning/export | Adaption Adaptive Data | Admin-only dataset quality/export story. |
| Synthetic screenshots | fal.ai Model APIs | Extra scam-like visual artifacts. |
| Media understanding | Gemini image understanding | Explain visual/contextual red flags. |
| Voice coach | Gemini Live API | Best Voice Agent sidecar. |

## AI Pipeline

Use one strict JSON contract for generation. Reject or repair non-JSON output.

```text
normalize input locally
-> defang URLs
-> mask PII locally before external calls
-> optional safety screen
-> cheap structured scam check / label extraction
-> instant SecondLook result
-> optional admin review / quiz creation
-> structured drill draft generation after admin action
-> optional safe personalization of scenario wording
-> final admin approval
-> publish approved drill
-> log cleaned dataset row
```

Rules:

- Never equate `spam` with `phishing`.
- Never render suspicious URLs as clickable links.
- For submitter results, return `verified_scam`, `suspected_scam`, or `legitimate`.
- Use `verified_scam` only for reviewed seed/source/admin-confirmed patterns; LLM-only harmful-looking output is usually `suspected_scam`.
- For quiz questions, prefer "what should you do next?" over "is this real?"
- Use `benign_contrast` examples so the game does not teach paranoia.
- Treat AI output as draft material until admin approval.
- Keep cached deterministic model outputs for the final demo.
- Do not use GPT-5.5 as the default. It is an escalation model only.
- Personalization must use profile fields, not original redacted PII.

Recommended model routing:

```text
classification/extraction: gpt-5.4-nano
drill draft/explanation: gpt-5.4-mini
hard escalation only: gpt-5.5
hosted fallback: OpenRouter with strict JSON schema
open-model fallback: Cloudflare Workers AI
local fallback: Ollama structured outputs
offline fallback: deterministic seed rows
```

## Provenanced Media Drill

This is now the strongest Exa/Gemini addition.

```text
topic or suspicious media claim
-> Exa search retrieves source candidates
-> store title, URL, author, publishedDate, image URL, highlights, requestId
-> Gemini analyzes source image and page context
-> Veo/fal creates synthetic contrast artifact
-> admin approves pair
-> player chooses safest next action
```

Example drill:

```text
"This flood photo is being shared as today's Singapore storm."

A. Share it because the image looks real
B. Search for the earliest/source page and compare date/location
C. Ask an AI detector if it is fake
D. Ignore all images online
```

Correct answer: B.

The lesson is provenance, not detector certainty. Exa provides source candidates; Gemini explains visible/contextual differences; humans approve the teaching label.

## Safe Personalization

Personalized drills can look more realistic, but only if they do not undo redaction.

Allowed:

- Locale and language.
- Common channel: SMS, WhatsApp, email, social post.
- Broad family role labels: parent, teen, grandparent.
- User-selected placeholders: `[your bank]`, `[delivery app]`, `[school portal]`.
- Weak-skill targeting from quiz history.

Forbidden:

- Real names, addresses, phone numbers, account numbers, payment details, government IDs, exact workplace, exact school, or any string removed by redaction.
- Personalizing a scam with a real relative's name.
- Sending personalized deceptive simulations to non-consenting users.

Implementation rule:

```text
raw submission -> redact/defang -> scam check -> admin-approved quiz draft -> apply safe profile placeholders -> admin publish
```

For the hackathon, use mock auth/profile data. Production auth remains out of scope.

## Adaption Labs Dataset Cleaning

Use Adaption as the sponsor-visible dataset quality layer, not as a realtime phishing detector.

### Where It Fits

```text
raw public row or user submission
-> defang/redact locally
-> admin-approved seed batch
-> Adaption ingest/adapt/evaluate/export
-> cleaned candidate dataset rows
-> OpenAI/OpenRouter/Ollama drill drafting if needed
-> human admin review
-> approved drill + cleaned dataset row
```

Adaption should improve or validate the dataset fields that make SecondLook more than a quiz app:

```text
content_type
source_dataset
original_label
scenario
scope_status
threat_type
risk_level
red_flags
safest_action
skill_tags
review_notes
```

The admin UI should show an "Adaption dataset run" panel beside the dataset export view. That is the visible sponsor loop: messy seed data becomes normalized, evaluated, reviewable teaching rows.

### PhiUSIIL Pair Generation

Use PhiUSIIL to create legitimate-vs-phishing contrast pairs. The pair is a candidate teaching artifact, not proof by itself.

```text
PhiUSIIL CSV
-> split `label = 1` legitimate rows and `label = 0` phishing rows
-> compute lexical similarity over domain, URL tokens, and page title
-> add explainability signals from URL/page features
-> select high-contrast candidate pairs
-> verify the legitimate side with Exa
-> generate safe synthetic SMS/email/chat scenarios
-> defang every suspicious URL
-> submit to admin review as pending drills
```

Pairing signals:

```text
domain token overlap
title token overlap
brand/entity token similarity
suspicious TLD or free-hosting domain
URL length and subdomain count
HasObfuscation
NoOfURLRedirect
HasExternalFormSubmit
HasPasswordField
Bank, Pay, Crypto
```

Exa role:

```text
input: likely legitimate brand, domain, or page title
output: official website, short entity description, trusted support/security URL if available, provenance metadata
```

Do not browse live phishing pages with Exa. Exa verifies the legitimate side and provides normal-company context; the suspicious side stays defanged and feature-derived.

Generated drill shapes:

```text
lookalike_domain_pair
hosted_impersonation_pair
brand_action_mismatch_pair
benign_contrast_pair
```

AI generation should create safe wrappers around the pair, for example a forwarded SMS, email, or chat message that references the defanged suspicious URL. It must not create clickable malicious links, credential collection flows, or instructions for running a phishing page.

### Demo-Safe Contract

Send Adaption only redacted/defanged rows during the hackathon demo. Treat Adaption as batch/offline:

```json
{
  "adapter": "adaption",
  "input_file": "secondlook_seed_rows.jsonl",
  "max_rows": 30,
  "estimate": true,
  "column_mapping": {
    "prompt": "scenario",
    "completion": "teaching_labels"
  }
}
```

Expected response:

```json
{
  "dataset_id": "string",
  "run_id": "string",
  "estimated_credits": 0,
  "status": "completed",
  "export_url": "string",
  "quality_summary": {
    "before": "string",
    "after": "string"
  }
}
```

### Fallback

If Adaption API access is unavailable, use the same `DatasetAdapter` locally with deterministic seed rows and label it clearly in the UI as `local_cleaning_fallback`. Do not pretend a local fallback is a live sponsor integration.

## Scam Check JSON Contract

```json
{
  "scam_status": "suspected_scam",
  "scope_status": "in_scope_phishing_or_scam",
  "threat_type": "payment_theft",
  "risk_level": "high",
  "red_flags": ["small unexpected payment", "urgent delivery pressure", "unfamiliar defanged link"],
  "safest_action": "Open the delivery company's official app or website directly.",
  "skeptical_claims": [],
  "skill_tags": ["urgency_trap", "link_inspection", "official_source_check"]
}
```

For `legitimate`, keep `red_flags` empty or low confidence and populate `skeptical_claims` with any claims, requests, or links the user should still treat carefully.

## Drill JSON Contract

```json
{
  "scenario": "string",
  "scope_status": "in_scope_phishing_or_scam",
  "threat_type": "credential_theft",
  "risk_level": "high",
  "red_flags": ["urgent deadline", "unfamiliar defanged link"],
  "safest_action": "Open the official site or app directly instead of clicking the link.",
  "skill_tags": ["link_inspection", "urgency_trap", "official_source_check"],
  "answer_choices": [
    { "id": "A", "text": "Click the link to check quickly." },
    { "id": "B", "text": "Open the official app or website directly." },
    { "id": "C", "text": "Forward it to family." },
    { "id": "D", "text": "Reply with your account details." }
  ],
  "correct_answer": "B",
  "explanation": "The message creates urgency and points to an unfamiliar link. The safest move is to use the official app or website directly."
}
```

## Seed Plan

Build 20-30 deterministic examples before polishing UI:

- 6 phishing email examples from Figshare-derived patterns.
- 6 URL-inspection drills from PhiUSIIL-style phishing/legitimate contrast.
- 8 synthetic SMS/WhatsApp scams covering delivery fees, bank alerts, fake government notices, job scams, payment requests, and account verification.
- 4 benign contrast examples.
- 4 Exa-provenanced real image/source drills.
- 2-4 Gemini Veo/fal.ai synthetic media contrast drills if the visual flow is demo-ready.

Do not pitch Kaggle or unknown-provenance rows as verified real-world corpora. Label them as reviewed seed material.

## Manual Setup

1. Scaffold the app in a `web/` folder:

```powershell
npx create-next-app@latest web --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
cd web
npm install convex zod lucide-react clsx tailwind-merge
npm install openai @fal-ai/client
npx convex dev
```

2. Copy environment values:

```powershell
Copy-Item ..\.env.sample .env.local
```

3. Create API access:

- OpenAI: create an API key and set `OPENAI_API_KEY`.
- Convex: run `npx convex dev`; copy `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`, and deployment key if needed.
- fal.ai: create an API key only if generating synthetic screenshots live; otherwise use pre-generated assets.
- Adaption Labs: set key/base URL only if sponsor access is available and the normalization/export loop is shown.
- PhishTank/Kaggle: optional data ingestion only. Do not block the demo on these.

4. Run locally:

```powershell
npm run dev
```

5. Demo route order:

```text
/submit -> /admin -> /challenge/{approvedDrillId} -> /dashboard
```

## Build Sequence

1. Create seed data, scam check schema, drill schema, and deterministic outputs.
2. Build mobile `/submit` with browser-side PII masking, URL defanging, redacted submission display, and cached scam status result.
3. Build `/admin` review queue with LLM judge prefilter fields and quiz draft editor.
4. Build publish flow from reviewed item into approved question pool.
5. Build `/challenge/[id]` mobile quiz with immediate correct/wrong feedback and missed-cue explanation.
6. Add `/dashboard` with skill stats, question pool counts, attempts, and dataset rows.
7. Add Convex persistence for submissions, scam checks, drafts, approvals, and attempts.
8. Add live OpenAI generation behind the same cached contracts.
9. Add fal.ai, Exa, Gemini, or Adaption only if the text path is already polished.
10. Record a 60-second fallback demo with cached outputs.

## Fallback Plan

Keep these ready:

- `DEMO_MODE=true` deterministic path.
- Seeded submissions and model outputs.
- Local image assets instead of live fal.ai calls.
- Static "generated dataset rows" export.
- A screen recording of the full path.

If OpenAI, Convex, Exa, Gemini, or fal.ai fails live, the judge should still see the exact same product story.
