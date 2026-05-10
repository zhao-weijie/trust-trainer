# Trust Trainer Clean Slate Contract

## Product

Trust Trainer turns one suspicious screenshot into a privacy-scrubbed submission, then turns reviewed cases into short family safety drills.

## Public Flow

1. `/submit`: upload screenshot, scrub PII in the browser, bake redactions, submit.
2. Result: `confirmed scam`, `suspected scam`, or `legitimate`, with one action: submit another.
3. `/drill`: answer one approved quiz, see a warning-sign explanation/infographic, then continue to the next drill.

## Admin Flow

No public admin frontend. Admin uses API-key protected endpoints to list pending drafts, approve, reject, or replace draft JSON.

## Keep

- Next.js and Vercel setup.
- Convex dependency and generated/config setup.
- fal.ai image-generation prompt ideas.
- `web/public/fal-seeds/messenger-scam-template.png`.

## Kill

- All old product UI.
- All old routes.
- All old custom components and CSS.
- Public admin and dashboard pages.
- Old Convex schema, functions, and dataset pipeline.
- Server-side attempt tracking.

## Build Rules

- Clean slate implementation on the active mainline branch.
- Old app is archived on `hackathon-fail` and tagged `pre-clean-rebuild`.
- Use shadcn primitives only where useful.
- Do not add auth, dashboard, browser extension, WhatsApp automation, public sharing, or model retraining.
- `npm run build` is the verification gate.
