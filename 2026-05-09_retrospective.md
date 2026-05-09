# 2026-05-09 Retrospective

## Summary Arc

The project started as a broad hackathon strategy and product thesis around digital trust, scam literacy, and family-facing safety training. Early commits were mostly commitment artifacts: prize strategy, sponsor mapping, architecture, stories, dataset rules, and explicit scope boundaries.

The first major narrowing was the move from "digital trust and safety ideas" to Trust Trainer: suspicious content becomes a redacted safety result, then a human-reviewed drill, then a dashboard signal. That gave the project a clear demo loop instead of a pile of adjacent safety features.

The second major narrowing was technical. The project moved from docs and mocks into a Next.js + Convex web app with deterministic seed data, an admin review queue, playable challenges, and a dashboard. After that, the priority shifted from breadth to making the production path work reliably.

The third arc was demo sharpness. fal.ai image generation was added, then tightened into safe seed-image edits and automatic generation on approval. Mobile flow was simplified, but the review path was restored because removing it weakened the core thesis: AI drafts, humans approve, families play.

The final cleanup made the deploy path cleaner: root scripts for Vercel, a default `/challenge` route, updated demo URL, ignored local Vercel files, and no accidental Playwright alpha dependency. The repo now reflects a hackathon demo path rather than a half-product trying to be everything.

## Key Decisions and Pivots

- Chose Trust Trainer as the committed product instead of a generic trust/safety toolbox.
- Prioritized the visible demo loop: `/submit -> /admin -> fal.ai drill image -> approve -> /challenge -> /dashboard`.
- Made human admin review a core product decision, not an implementation detail.
- Treated AI output as draft material until approved.
- Drew a hard scope line around phishing, scams, impersonation, credential theft, payment theft, malicious links, and benign contrast examples.
- Rejected weak expansion areas: generic spam, broad fact checking, truth arbitration, production auth, browser extension, automatic WhatsApp delivery, and real model retraining.
- Used public datasets only as bootstrap material, with teaching labels and human review, instead of pretending they solve the long-term data gap.
- Kept URLs defanged and PII redacted before display or drill generation.
- Picked a production-build-first workflow. `npm run build` became the verification gate; dev-server-only weirdness is not worth chasing unless it blocks edits.
- Added fal.ai where it strengthens the demo: safe synthetic multimodal artifacts generated from approved scam scenarios.
- Pivoted from raw generation toward seed-image edits, which is safer and more controllable for a public demo.
- Simplified mobile UX, then reversed the part that hid the review path because it made the app look like a quiz instead of a reviewed safety workflow.
- Cleaned deployment by adding a root script shim and Vercel config while keeping dependencies inside `web/`.

## Start

- [Agree, P0] Start the next hackathon with an explicit "recorded demo is the artifact" mindset. The build should serve the submitted video, not an imagined production app.
- [Agree, P0] Start writing the demo script earlier, even if the app is still rough. The script is a scope-control tool, not just a final presentation asset.
- [Disagree, we should build from 1 core user story and get it working instead of trying to 1-shot the full app] Start keeping a small set of pre-approved, deterministic demo cases from the beginning so the final recording does not depend on live improvisation.
- [Agree, P0] Start making sponsor value visible in the product surface earlier. The docs made the sponsor thesis clear, but the recorded demo has to carry that argument by itself.
- [Agree, P0] Start committing cleaner narrative checkpoints: strategy, product commitment, first working loop, sponsor integration, demo polish, submission cleanup.
- [Disagree, we should instead clean as we go instead of having to do one giant cleanup pass]Start treating the last cleanup pass as part of submission quality, not optional housekeeping.
- [user addition, P0] start researching sponsors earlier and reading their docs to understand where they come in
- [user addition, P0] start by designing the critical surfaces shown in the demo - not the backend architecture and actually iterate fast with myself as the user. We only had 3-4 actual iteration loops where I gave critical feedback this time. This resulted in drift and poor quality of the final experience, and I suspect a lot of tech debt.

## Stop

- [Agree, P1] Stop letting the project spend too long as a broad thesis before forcing the demo shape. The early strategy was useful, but the app only became sharp once the loop was concrete.
- [Disagree, Need to downselect sponsors instead of trying to gun for everything] Stop adding integrations unless they change what the judge sees in the submitted artifact. Sponsor logos and buried architecture notes are not enough.
- [Agree, P2 - I think this was a specific semantic failure of the coding agent because spam and scam are lexically and semantically close - a lot of search engines return spam when searching for scam] Stop treating generic spam as nearby enough to phishing. The distinction mattered and should stay enforced from the first dataset decision.
- [Reframe, we should be realistic about scope - focused production-quality data labeling work is not feasible in a 7h hackathon from scratch] Stop over-investing in weak-provenance datasets. They can support internal ideation, but they should not become claims in the pitch.
- [Reframe, the Browser Use skill and app browser backend kept failing so this was a desperation move - ensure tooling is on a stable, proven version before the hackathon] Stop allowing accidental tooling dependencies into the repo. The Playwright alpha package was exactly the kind of hackathon residue that makes a project look sloppier than it is.
- [Agree, P0 - reframe as simplification to 1 path to get working] Stop optimizing for dev-server convenience after the demo path is known. Production build/deploy was the right gate.
- [Reframe, need to enshrine critical user stories and acceptance criteria as first-class context] Stop hiding the human review step for UX simplicity. The review step was the product's trust claim.

## Continue

- [Partially agree, good to have direction but what harmed us was over-speccing at the start - we don't know what we don't know - this prevented us from downscoping earlier if we run into feasibiliity issues. We should decompose the criitical path first] Continue making a hard product commitment before building. The Trust Trainer rename and one-liner gave the rest of the work a spine.
- [Partially agree, P2 - not transferrable to future projects] Continue defending the review-before-play model. It was the strongest product decision and separated the project from a thin AI quiz generator.
- [Agree, P0] Continue using deterministic, demo-safe seed data. It made the recorded submission more controllable.
- [Partially agree, P2 - didn't help us and may have overcomplicated] Continue requiring teaching labels for every example: `scope_status`, `threat_type`, `risk_level`, `red_flags`, `safest_action`, and `skill_tags`.
- [Agree, P2 - not extremely applicable] Continue defanging suspicious URLs and avoiding clickable malicious links. That safety posture was central to the project's credibility.
- [Reframe, should have experimented more with prompt tuning and have more flexible seed images for each communication type. Need suggestions on how to make such obvious quick wins surfaced and implemented early] Continue using fal.ai for safe synthetic artifacts instead of scraping random web images.
- [Reframe, we need to identify the key differentiation early] Continue making the admin flow visible. It proved this was a trustworthy training pipeline, not just instant AI labeling.
- [Agree, P0 - generalize further to use only one validation path] Continue using `npm run build` as the required verification gate. It kept the final submission aligned with the deployed demo path.
- [Reframe, we should do retrospectives like this to learn how to improve after hackathons] Continue doing a repo cleanup commit after submission. The final state now tells a clearer story than the frantic middle of the hackathon.

## Post-Submission Lessons

- [Agree] The best decision was narrowing the product to a judged story: suspicious content becomes a redacted result, a human-approved drill, and a family skill signal.
- [Agree] The most important pivot was restoring the review path after simplifying mobile flow. Without that, the project risked looking like a quiz app.
- [I'm not sure - what about being able to spin up a two-sided backend with convex?] The strongest sponsor integration was fal.ai when tied to approved drill artifacts. It was visible, demoable, and safer than scraping real scam images.
- [Strongly agree - need to keep scope narrow - build a motorcycle before building a car. Not build the car's wheels first] The weakest recurring risk was scope gravity. Browser extensions, WhatsApp automation, auth, live datasets, and fact-checking all sounded plausible but would have diluted the submitted demo.
