---
status: active
summary: "Build a deployed phone-testable Trust Trainer demo with Convex-backed submit, review, quiz, and dashboard flow."
created_ts: "2026-05-09T13:55:24.1079519+08:00"
updated_ts: "2026-05-09T13:55:24.1079519+08:00"
---

# Trust Trainer Vercel Demo Plan

## Summary

Build the deployed, phone-testable demo around the `suspected_content_forwarder` stories: paste suspicious content, redact PII and defang URLs before analysis, show a cautious scam result, submit to human review, approve a quiz draft, play the new drill, and see dashboard updates. Use Stitch `DESIGN.md` as the visual source of truth, but do not copy the rough generated screens.

## Key Changes

- Add Convex as the shared backend so phone/admin/dashboard state persists across devices on Vercel.
- Keep deterministic local analysis as the default fallback; no live AI key should be required for the judged demo.
- Preserve architecture contracts from `web/src/lib/types.ts`; backend models must not change product semantics.
- Refactor UI into reusable components using Stitch `DESIGN.md`: warm neutral shell, blue actions, compact Roboto typography, artifact base layer plus analytics panel.
- Upgrade `next`, `react`, `react-dom`, and lockfile before deployment unless it breaks the build under time pressure.

## Implementation Changes

### Backend

- Add Convex schema for submissions, approved drills, attempts, and dataset rows.
- Add queries/mutations for seed/reset, submit, list queue, update draft fields, approve, reject, mark out-of-scope, record attempt, and dashboard stats.
- Move pure lifecycle logic out of `localStorage` into shared helpers: seed state, redaction, defanging, heuristic labeling, approval-to-drill, approval-to-dataset-row.
- Do not auto-upload existing localStorage state because it may contain raw suspicious content.

### Submit Flow

- Implement Stitch flow states: pasted content -> PII scrubbing disabled submit -> redacted preview -> enabled submit -> analysis/result.
- Show the redacted/defanged artifact visibly before result.
- Result must show scam status, red flags, safest action, caution notes for legitimate cases, and submit-for-human-review.
- Heuristic/model-only harmful content must be `suspected_scam`, not `verified_scam`.

### Admin And Review Flow

- Queue reads from Convex and includes seeded and user submissions.
- Admin editor exposes scam status, scope status, threat type, risk level, red flags, safest action, skill tags, answer choices, correct answer, and explanation.
- Approve publishes an approved drill and dataset row immediately.
- Reject/out-of-scope states remain explicit; spam is never treated as phishing.
- Add a lightweight admin/demo token gate for mutating admin actions if time permits.

### UI System

- Create reusable primitives: `Button`, `Panel`, `BaseContentLayer`, `AnalyticsPanel`, `ResultPanel`, `ReviewQueueRow`, `ReviewEditor`, `DrillOptions`, `DatasetLabels`, `MetricCard`, `SegmentedControl`.
- Use one `AppShell` and one navigation model across pages; no copied Stitch nav fragments.
- No nested cards, no marketing hero, no purple-dominant palette, no giant typography.
- `/submit` and `/challenge` must be excellent on mobile; `/admin` can be denser but still usable.

### Deployment

- Link/create Vercel project for `web`.
- Configure Convex env vars in Vercel.
- Deploy preview early, then verify the full path from phone.
- Keep a seeded playable drill fallback so the demo survives if submit/admin has issues.

## Test Plan

- Build/check: `npm run build`; verify upgraded dependency install and lockfile.
- Mobile submit: paste suspicious SMS/WhatsApp/email text; confirm PII redaction and defanged URL display before analysis; confirm result shows `suspected_scam`, 2-4 red flags, and one safest next action.
- Cross-device: submit from phone; open admin on desktop and confirm the same item appears; edit and approve the draft; open the new challenge on phone, answer wrong, see missed cue feedback; dashboard updates attempts, accuracy, weak skills, approved count, and dataset rows.
- Boundary cases: advertising/coupon text becomes `out_of_scope_spam`; legitimate example shows `legitimate` with skepticism/caution notes; rejected/out-of-scope items are not playable.
- Visual checks: `/submit`, `/admin`, `/challenge/[id]`, `/dashboard` share the same nav, buttons, panels, badges, and typography; no text overflow at phone width; artifact content remains the visual focus.

## Assumptions

- Convex real backend is the target.
- Vercel preview URL is sufficient for phone testing.
- Deterministic demo mode is acceptable and preferable under time pressure.
- Admin token gate is best-effort for hackathon preview, not production auth.
- Whole-state/simple mutations are acceptable for one-team demo traffic, not production concurrency.
