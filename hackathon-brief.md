# Hackathon Brief

## Event

- Hackathon: AI Engineer Hackathon
- Deadline: Today; roughly 7 hours from intro guidance
- Time remaining: Treat as enough time for polish, not enough time for a broad product
- Team: TBD
- Allowed tools: Sponsor APIs/SDKs, OpenAI/Codex, OpenAI Privacy Filter, Adaption Labs, Cursor SDK, Fal, Convex, Exa, Gemini/Veo/Lyria/Live, other sponsor tools if used meaningfully

## Prize Strategy

- Primary prize target: Overall winner
- Backup prize target: Most creative use of Exa, if the demo includes provenanced real-image retrieval versus synthetic fake media contrast.
- Secondary backup: Gemini Best Gen Media, if the demo includes a Veo/Gemini-generated fake-media drill paired with Exa-provenanced real media.
- Additional backup: OpenAI / Codex for redaction, drill generation, admin editing support, and privacy-filtered safety workflow.
- Additional backup: Adaption Labs, if the demo visibly turns messy public scam datasets into normalized, reviewed teaching datasets.
- Grand-prize path: Stand out with an unhinged but polished live demo, land the hook in the first 5-10 seconds, then show only the secret sauce.
- Sponsor/judge thesis: Judges want a memorable, polished, demoable system with a hook in the first 5-10 seconds. Sponsor tools must be part of the core loop, not pasted onto the pitch.

## Project Commitment

- Project name: Trust Trainer
- One-liner: Trust Trainer gives families an instant safety check on suspicious digital content, then turns reviewed cases into safety drills that teach when to click, ignore, verify, report, or pause before sharing.
- Target user: Non-AI-native families and everyday internet users who forward suspicious messages, screenshots, emails, posts, or links to a more technical person for help.
- Pain: Suspicious content is everywhere, but most users do not know what to inspect, what action to take, or when sharing/clicking becomes risky.
- Why now: AI has made convincing scams, fake screenshots, synthetic media, and hallucinated claims cheap enough to flood normal inboxes, group chats, and feeds.
- Why this hackathon/sponsor: OpenAI supports privacy-filtered scam checks and practical next-action drill drafts; Convex makes intake, review, approval, and progress feel live; Exa retrieves provenance candidates for real-image/source contrast drills; Gemini/Veo can generate or analyze media examples; Adaption can turn messy public scam datasets into normalized, reviewed teaching rows; fal.ai can generate safe multimodal scam-like artifacts without using live harmful images.

## Demo Story

- The Pledge: "This is the message your parent forwards you at midnight asking if it is real."
- The Turn: Forward/paste a suspicious WhatsApp-style message or email, then watch Trust Trainer redact PII browser-side and return a clear result: verified scam, suspected scam, or legitimate.
- The Prestige: A human admin turns the reviewed case into a quiz question, a family member plays it, and the dashboard shows which trust/safety instincts the family is building.
- First wow moment: Suspicious content becomes a redacted, defanged Trust Trainer result with red flags and safest next action in under 10 seconds.
- Final reveal: "AI gives the first pass, humans approve what gets taught, and one scary message trains the whole family."

## MVP Path

- Must work live: Email forwarding intake or realistic forwarded-email webhook simulation; WhatsApp paste/screenshot/share intake; browser-side PII redaction and URL defanging; instant scam status result; admin review queue; quiz draft edit/approve/reject flow; playable family challenge; skill graph/dashboard.
- Can be seeded: 20-30 suspicious and legitimate examples; Exa-provenanced real image/source examples; generated synthetic media contrast examples; generated drill outputs; family answer history; review decisions; cleaned dataset rows from the prioritized sources below.
- Can be mocked: Real WhatsApp Business API approval, production email infrastructure, authentication, payment-grade abuse controls, full moderation ops, real model retraining.
- Nice-to-have only: Browser extension, public challenge marketplace, leaderboard, voice/video drills, multilingual mode, real inbox connectors beyond forwarding.

## Build Architecture

- Product stories: `STORIES.yaml`.
- Build plan: `ARCHITECTURE.md`.
- Sponsor/tooling matrix: `SPONSOR_TOOLING.md`.
- Environment contract: `.env.sample`.
- Demo route: submit suspicious content -> instant Trust Trainer result -> admin review/quiz creator -> playable challenge -> skill dashboard.
- Technical stance: ship a polished deterministic demo first, then wire sponsor tools behind adapters with OpenRouter/Ollama/local fallbacks.
- Key rule: AI output is draft material until a human admin approves it.

## Seed Dataset Strategy

- Scope boundary: generic spam is out of scope. Only use examples that involve phishing, smishing, impersonation, credential theft, payment theft, harmful scams, malicious links, or legitimate contrast cases.
- Do not treat `spam` as equivalent to `phishing`. Spam-only datasets are weak seed sources unless individual rows can be re-labeled as a concrete harm scenario.
- Dataset gap thesis: Public datasets are decent for phishing emails and phishing URLs, but weak for family-facing SMS, WhatsApp, and chat scams. Trust Trainer uses public datasets only to bootstrap. The long-term moat is a reviewed, privacy-preserving dataset of real consumer scam scenarios, labeled by safest next action rather than just malicious/benign.
- Priority 1: Phishing Email: 11 Curated Datasets - https://figshare.com/articles/dataset/Phishing_Email_11_Curated_Datasets/24952503
  - Use for forwarded-email intake demos and phishing-only examples, especially Nazario and Nigerian Fraud subsets.
  - Prefer subsets explicitly labeled phishing over mixed spam/phishing corpora.
  - License: CC BY 4.0.
- Priority 2: PhiUSIIL Phishing URL Dataset - https://archive.ics.uci.edu/dataset/967/phiusiil+phishing+url+dataset
  - Use for URL-inspection drills and official-site verification scenarios.
  - Contains 235,795 URL/webpage instances: 134,850 legitimate and 100,945 phishing URLs.
  - Labels are explicit: `1 = legitimate`, `0 = phishing`.
  - Includes URL and webpage-derived features, useful for explaining why a link looks risky.
  - Best use is paired legitimate-vs-phishing contrast drills, not dumping raw URLs into the quiz pool.
  - Cluster phishing rows near legitimate rows by domain/title/token similarity, then use Exa to verify the legitimate company, official site, and normal user action.
  - Use AI models to turn verified pairs into safe synthetic SMS/email/chat scenarios for ingestion into the human review flow.
  - License: CC BY 4.0.
- Priority 3: Curated synthetic smishing/WhatsApp seed set
  - Use OpenAI plus human review to create 8-12 modern SMS/WhatsApp-style phishing scenarios: delivery fee scams, bank alerts, fake government notices, toll scams, account verification, job scams, and payment requests.
  - Mark source as `synthetic_seed`, not public dataset.
  - Use only after admin approval; keep these as demo-safe examples rather than pretending they are real corpus rows.
- Auxiliary reviewed source: Unified Scam Detection - https://www.kaggle.com/datasets/sarazahran1/unified-scam-detection
  - Referenced by the Advanced Scam Message Detection notebook: https://www.kaggle.com/code/sarazahran1/advanced-scam-message-detection
  - Interesting because the schema appears close to Trust Trainer's teaching model: `scammer_message`, `user_response`, `scam_tactic`, `risk_level`, `response_type`, `user_success`, and tactic indicators.
  - License: Apache 2.0 according to Kaggle.
  - Treat as reviewed/synthetic-style seed material only. Kaggle has little dataset description/provenance, so do not pitch it as a verified real-world scam corpus.
  - Run every row through `scope_status` and admin review before use.
- Live URL feed backup: PhishTank verified phishing feed - https://phishtank.org/developer_info.php
  - Use only if live/current phishing URL examples strengthen the demo.
  - Treat URLs as dangerous: defang all links as `hxxps://domain[.]example`, never render clickable malicious links.
  - Best used for domain/link patterns, not for directly sending users to phishing pages.
- Static URL backup: LegitPhish - https://pmc.ncbi.nlm.nih.gov/articles/PMC12538017/
  - Use if PhiUSIIL is inconvenient to process.
  - Contains manually verified phishing and legitimate URLs with structural features; useful for link-inspection challenges.
  - License: CC BY 4.0.
- Explicitly deprioritized: UCI SMS Spam Collection and broad SpamAssassin/TREC spam corpora.
  - They are useful for spam filtering, not trust/safety teaching.
  - Use only for benign contrast or if Adaption/human review re-labels a row into a concrete phishing/scam scenario.

Adaption Labs role:

```text
raw public dataset row or user-submitted suspicious message
-> normalize content type and source metadata
-> redact or defang sensitive/risky content
-> generate teaching labels
-> generate answer choices and explanation
-> human admin review
-> approved drill dataset
-> anonymized structured row for the missing smishing/consumer-scam dataset
```

PhiUSIIL paired-contrast adaptation:

```text
legitimate URL row + nearby phishing URL row
-> lexical/domain/title similarity candidate pair
-> Exa verification of the legitimate entity and official source
-> synthetic family-facing suspicious message or email wrapper
-> defanged links and teaching labels
-> human admin review
-> approved legitimate-vs-phishing drill
```

Adaption sponsor thesis: Trust Trainer is not just cleaning existing datasets. It adapts raw public phishing URL rows into paired, Exa-grounded, human-reviewed teaching examples, then helps create the missing reviewed SMS/WhatsApp scam literacy dataset from real user submissions.

Required normalized labels:

```text
content_type, source_dataset, original_label, scenario, threat_type, risk_level,
red_flags, safest_action, skill_tags, answer_choices, correct_answer,
explanation, review_status, scope_status
```

`scope_status` must be one of:

```text
in_scope_phishing_or_scam, benign_contrast, out_of_scope_spam, reject
```

## Multimodal Strategy

- Use Exa to retrieve provenanced real source candidates for real-vs-synthetic media drills.
- Store source metadata: title, URL, author, published date, image URL, highlights, and request ID.
- Use Gemini/Veo or fal.ai to generate safe synthetic contrast artifacts.
- Do not treat Exa as a truth oracle; it retrieves provenance candidates.
- Do not scrape or hotlink random web images into public drills. Admin-approved demo source packs are acceptable.
- Every generated image or screenshot drill still enters `pending_review` before it can be played.

## Personalization Strategy

- Personalization is allowed only after browser-side redaction and only from authenticated/user-provided profile fields.
- Do not reinsert original PII into drills.
- Safe personalization examples: locale, preferred language, common channel, family role labels, broad age band, and user-selected trusted institutions.
- Unsafe personalization examples: real names, phone numbers, addresses, account numbers, exact workplace, exact school, payment details, government IDs, or anything removed by the redaction step.
- Use placeholders such as `[your bank]`, `[family member]`, or `[delivery app]` when realism helps learning.
- For the hackathon, mock authentication and profiles. Do not build production auth.

## Do-Not-Build List

- Do not build a browser extension for this hackathon.
- Do not build automatic scam-drill delivery into WhatsApp groups.
- Do not build anything that sends deceptive simulations to non-consenting users.
- Do not build production-grade auth unless it is needed for the visible review flow.
- Do not build real AI image/video detection.
- Do not build real fact checking or truth arbitration.
- Do not build public sharing of user-submitted examples without review and consent.
- Do not show live malicious URLs as clickable links.
- Do not scrape random web images into user-facing drills.
- Do not add sponsor APIs unless they are visible in the demo loop.

## Risks

- Top demo risk: The project looks like a quiz app instead of an instant safety checker plus reviewed training loop. Fix by opening with a pasted suspicious artifact receiving a redacted Trust Trainer result, then show admin-reviewed quiz creation.
- Top integration risk: Real WhatsApp Business API access is slow or unavailable. Fix by making paste/screenshot/share intake live and describing WhatsApp API as production intake.
- Top time risk: Overbuilding messaging integrations instead of the review-and-play loop judges can see.

## Fallback Plan

- Backup demo path: Local app with seeded "forwarded" emails and WhatsApp screenshots that run through the same redaction, instant scam check, review, approval, and challenge flow.
- Seed data: 20-30 examples across delivery scams, bank alerts, fake government notices, credential phishing, payment theft, impersonation, investment scams, fake screenshots, malicious-link inspection, AI-image rumors, and legitimate contrast examples. Use Figshare's Phishing Email 11 Curated Datasets and UCI PhiUSIIL as the two reliable public labeled sources; fill SMS/WhatsApp gaps with reviewed synthetic smishing scenarios. Use PhishTank for live URL examples only if useful and LegitPhish as the static URL backup.
- Screenshots/video needed: Record a perfect 60-second fallback of: submit suspicious content -> redacted scam status -> admin quiz draft -> admin approval -> family challenge -> skill dashboard.
- Offline/local plan: Cache model outputs and use deterministic generated drills if APIs fail.
