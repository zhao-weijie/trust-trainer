# AGENTS.md

## Communication

- Answer directly and concisely.
- Be honest about weak ideas, bad scope, or risky assumptions.
- Prefer working artifacts over long explanations.

## Project

- Project: Trust Trainer.
- Goal: Turn suspicious digital content into human-reviewed safety drills, record a demo to win hackathon prizes.
- Core loop: suspicious content -> AI PII redaction -> human admin review -> playable family challenge -> skill dashboard.

## Scope

- In scope: phishing, smishing, impersonation, credential theft, payment theft, harmful scams, malicious links, and legitimate contrast examples.
- Out of scope: generic spam, advertising, nuisance messages, broad fact checking, and truth arbitration.
- Do not treat `spam` as equivalent to `phishing`.

## Data Rules

- Every seed example needs teaching labels: `scope_status`, `threat_type`, `risk_level`, `red_flags`, `safest_action`, and `skill_tags`.
- `scope_status` must be one of: `in_scope_phishing_or_scam`, `benign_contrast`, `out_of_scope_spam`, `reject`.
- Defang all suspicious URLs before display, for example `hxxps://example[.]com/login`.
- Public datasets bootstrap the product; reviewed user submissions are the long-term dataset gap.
- Do not pitch weak or unknown-provenance datasets as verified real-world corpora.

## Build Priorities

- Prioritize the visible demo path over production completeness.
- Treat the production build/deploy path as the only build path that matters for the hackathon demo.
- Use `npm run build` as the required verification gate; do not spend time chasing dev-server-only issues unless they block editing.
- Build admin review before public sharing.
- Use deterministic seed data for demos.
- Use fal.ai for safe synthetic multimodal artifacts instead of scraping random web images.
- Do not build browser extension, automatic WhatsApp delivery, production auth, or real model retraining unless explicitly re-scoped.
