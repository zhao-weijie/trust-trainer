# Sponsor Tooling And Fallback Research

Date: 2026-05-09.

Goal: choose sponsor tools that strengthen the judged demo without making the core path fragile. The demo must still work with no sponsor API keys.

## Critical Path Matrix

| Product Need | Primary Tool | Why | Fallback |
|---|---|---|---|
| App state, review queue, attempts, dashboard | Convex queries/mutations/actions | Realtime review/admin UI is visible and fits the core loop. External API calls belong in Convex Actions. | Local JSON seed mode, SQLite/libSQL, or Supabase. |
| PII redaction before external calls | OpenAI Privacy Filter local/open-weight where available | It is built for local text PII masking, so user content can be redacted before leaving the machine. | Microsoft Presidio, deterministic regex, then model-assisted redaction with human review. |
| Cheap classification and label extraction | OpenAI Responses API with `gpt-5.4-nano` and Structured Outputs | Good fit for `scope_status`, `threat_type`, `risk_level`, `red_flags`, `safest_action`, and `skill_tags`. | OpenRouter structured outputs, Cloudflare Workers AI, Ollama structured outputs, deterministic seed output. |
| Drill draft and admin explanation | OpenAI Responses API with `gpt-5.4-mini` and Structured Outputs | Better than nano for answer choices and family-facing explanations after human review starts quiz creation. | OpenRouter model with strict JSON schema, Ollama local model, cached demo outputs. |
| Provenanced real-image retrieval | Exa Search API | Retrieves source pages with URLs, titles, dates, authors, snippets, and result images for "real source vs synthetic fake" contrast drills. | Curated local source packs with saved citations. |
| Synthetic video/image contrast | Gemini Veo 3.1 / fal.ai | Use generated video/image as safe fake examples beside Exa-provenanced real media. | fal.ai images, static mockups, pre-generated assets. |

## Optional Prize Expansions

These are not on the critical path. Add only after the submit -> review -> challenge -> dashboard loop is polished.

| Prize/Capability | Tool | Use | Cut If |
|---|---|---|---|
| Safety screen | OpenAI Moderation API | Abuse/safety screen before storing or showing submissions. | It delays the main demo path; admin review already gates publishing. |
| Hard-case escalation | `gpt-5.5` | Rare ambiguous examples or final admin explanation polish. | You are using it as the default. |
| Dataset cleaning/evaluation/export | Adaption Adaptive Data | Admin-only dataset improvement/export view. | The core review/play loop is not done. |
| Synthetic screenshots | fal.ai Model APIs | Safe fake screenshots and scam-like visual artifacts. | Veo/Gemini media path is already enough. |
| Real-vs-AI image analysis | Gemini image understanding | Explain source-image context and visual red flags. | Exa metadata alone tells the story. |
| Voice coaching sidecar | Gemini Live API / Gemini Flash Live | Optional "parent calls Trust Trainer" demo mode for Best Voice Agent. | Text chat, browser TTS, pre-recorded audio. |
| Generative music | Lyria RealTime | Only useful for a media-heavy bumper or generated scam-ad soundtrack. It does not strengthen the core safety product much. | Skip it. |
| Provider resilience, deploy hardening | Cloudflare AI Gateway, Workers, Turnstile, R2 | Gateway for provider routing/observability, Turnstile for public submit, R2 for uploaded assets if Convex storage is insufficient. | Direct provider calls, local file storage, no public submit. |
| Open-model hosted fallback | Cloudflare Workers AI | Useful sponsor fallback for classification/extraction if OpenAI/OpenRouter fail. | Ollama local or deterministic seed path. |
| Developer automation | Cursor CLI/SDK | Useful for generating scaffolds, tests, and seed tooling. Not a runtime product dependency. | Codex/manual scripts. |
| Isolated code/artifact lab | Daytona | Optional sandbox for generated parsers or preview apps. Not the core product. | Local Docker/devcontainer/plain scripts. |

## Recommended Runtime Flow

```text
user submission
-> local defang + PII redaction
-> optional safety screen
-> cheap scam-status and label extraction
-> instant Trust Trainer result
-> optional admin quiz creation
-> drill draft generation
-> admin review
-> approved challenge
-> attempt tracking
-> dataset row export
```

Provider order:

1. `DEMO_MODE=true`: deterministic local output. Always available.
2. OpenAI Privacy Filter / Presidio / regex: redact before external calls.
3. OpenAI `gpt-5.4-nano`: first-pass labels.
4. OpenAI `gpt-5.4-mini`: drill generation.
5. OpenRouter or Cloudflare Workers AI: hosted fallback.
6. Ollama: local/offline fallback.
7. `gpt-5.5`: rare escalation only.

## New Prize Impact

The new sponsor prizes change the best secondary target.

Primary remains Overall. Strong secondary targets now become:

1. Most creative use of Exa.
2. Gemini Best Gen Media.
3. OpenAI/Codex.
4. Cursor SDK.

The best new demo wedge is a provenance drill:

```text
claim or suspicious image topic
-> Exa retrieves real source pages with citations and image URLs
-> Gemini analyzes source image/content
-> Veo/fal generates a plausible fake contrast artifact
-> admin approves paired real-vs-synthetic drill
-> family player chooses safest next action
```

This is better than generic image detection because it teaches behavior: find source, compare provenance, do not share unsupported media.

Do not frame the product as "AI detector." Frame it as "provenance practice."

## Adaption Positioning

Adaption is not the live phishing detector. Its public docs describe Adaptive Data: ingest, adapt, evaluate, and export datasets.

Use it for a sponsor-visible admin path:

```text
approved seed/public rows
-> upload CSV/JSONL to Adaption
-> estimate small run with max_rows
-> adapt/evaluate
-> export cleaned rows
-> human admin approves before playable use
```

This is stronger and more honest than pretending Adaption is a realtime labeling endpoint. Build a `DatasetAdapter` interface so the app can run with:

- `adaption`: real Adaptive Data run.
- `local`: deterministic transform.
- `openrouter`: structured-output batch labeling.
- `ollama`: local structured-output batch labeling.

## OpenAI Positioning

Do not default to GPT-5.5. That is overkill.

Use:

- OpenAI Privacy Filter for local/open-weight PII masking if available.
- Moderation API for safety screening.
- Responses API plus Structured Outputs for JSON-constrained labels and drill drafts.
- `gpt-5.4-nano` for first-pass classification/extraction.
- `gpt-5.4-mini` for polished drill generation.
- `gpt-5.5` only for escalation.
- `store: false` for sensitive submissions when using OpenAI APIs.

## Cloudflare Positioning

Use Cloudflare to make the demo resilient, not to rebuild the backend:

- AI Gateway for provider routing, logs, limits, and fallback.
- Workers AI for open-model hosted fallback.
- Turnstile on public submit if deployed.
- R2 for uploaded images/media if Convex File Storage is not enough.
- Pages/Workers only if deployment needs it.

Do not add D1 unless Convex is cut. Splitting app state across Convex and D1 is unnecessary scope.

## fal.ai Positioning

Use fal.ai only for synthetic multimodal artifacts:

- scam-like screenshot drills
- fake delivery/bank notification mockups
- benign contrast screenshots
- suspicious product listing images

Every generated artifact still enters `pending_review`. Do not scrape random web images.

## Exa Positioning

Use Exa for provenanced real examples, not random web scraping.

Recommended calls:

- `/search` with `contents.highlights=true` for source pages.
- Include domain filters for reputable sources when creating benign/real contrast examples.
- Use `startPublishedDate` / `endPublishedDate` for current-event provenance drills.
- Store result metadata: title, URL, author, published date, image URL, highlights, and Exa request ID.
- Use `outputSchema` only when extracting structured source evidence from multiple results.

Exa results can include an `image` field and metadata for the source page. That is enough for a demo panel: "real sourced image" versus "AI-generated fake variant."

Rules:

- Do not hotlink arbitrary web images in final public content unless allowed; for the demo, store metadata and use admin-approved examples.
- Do not claim Exa proves truth. It retrieves provenance candidates.
- Do not use Exa to fetch live malicious pages.

## Personalization Positioning

Personalization is product polish, not a sponsor dependency.

Use it after redaction and during admin quiz creation to make drills feel local and relevant. The personalized version still needs final admin approval before publishing:

- locale
- preferred language
- channel
- broad family role
- user-selected placeholders
- weak-skill targeting

Do not use redacted raw PII. Reintroducing real names, account numbers, addresses, or phone numbers after redaction would be stupid and unsafe.

## Gemini Positioning

Use Gemini only where it is visually or audibly obvious:

- Gemini image understanding: analyze retrieved/source images and uploaded screenshots.
- Veo 3.1: generate one short fake scam/news/social-video artifact for media contrast drills.
- Gemini Live / Flash Live: optional voice coach where a parent describes a suspicious message and gets guided through "what should you do next?"
- Lyria RealTime: optional instrumental backing/sound design only. It is not worth core build time.

Do not shift the whole app into a voice agent or music/video toy. That would be reckless scope creep.

## Sources

- OpenAI Privacy Filter: https://openai.com/index/introducing-openai-privacy-filter/
- OpenAI models: https://developers.openai.com/api/docs/models
- OpenAI Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI Moderation: https://developers.openai.com/api/docs/guides/moderation
- OpenAI data controls: https://developers.openai.com/api/docs/guides/your-data
- Adaption docs: https://docs.adaptionlabs.ai/
- Adaption API keys: https://docs.adaptionlabs.ai/introduction/create-api-keys/
- Convex functions: https://docs.convex.dev/functions
- Convex realtime: https://docs.convex.dev/realtime
- fal.ai Model APIs: https://fal.ai/docs/model-apis
- Gemini image understanding: https://ai.google.dev/gemini-api/docs/vision
- Gemini Live API: https://ai.google.dev/gemini-api/docs/live
- Gemini Live capabilities: https://ai.google.dev/gemini-api/docs/live-guide
- Gemini Veo video generation: https://ai.google.dev/gemini-api/docs/video
- Gemini Lyria RealTime: https://ai.google.dev/gemini-api/docs/music-generation
- Google GenAI SDKs: https://ai.google.dev/gemini-api/docs/downloads
- Cloudflare Workers AI: https://developers.cloudflare.com/workers-ai/
- Cloudflare AI Gateway: https://ai.cloudflare.com/gateway
- Cloudflare R2: https://developers.cloudflare.com/r2/
- Cloudflare Turnstile: https://developers.cloudflare.com/turnstile/
- Daytona docs: https://www.daytona.io/docs/
- Cursor CLI: https://cursor.com/cli
- Exa Search API: https://exa.ai/docs/reference/search
- Exa docs: https://docs.exa.ai/
- OpenRouter structured outputs: https://openrouter.ai/docs/docs/features/structured-outputs
- Ollama structured outputs: https://docs.ollama.com/capabilities/structured-outputs
