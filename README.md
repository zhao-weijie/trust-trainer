# Trust Trainer

Trust Trainer turns suspicious digital content into human-reviewed family safety drills.

Public demo:

```text
https://web-one-rho-kt48p1kwl2.vercel.app
```

Core demo path:

```text
/submit -> /admin -> generate fal.ai drill image -> approve -> /challenge/[id] -> /dashboard
```

The app uses Convex shared state, deterministic demo heuristics, and a server-side fal.ai image-editing step for reviewed drills. User-submitted content is redacted and suspicious URLs are defanged before analysis or display.

Sponsor loop:

```text
reviewed scam scenario -> fal.ai seed-image edit -> admin approval -> playable family drill
```

`FAL_KEY` is optional. When it is missing, the app keeps the text-only demo path working and shows fal as not configured in admin review. The default edit seed lives at `web/public/fal-seeds/messenger-scam-template.png`.

## Local Development

Use one demo path: production build + production server. Do not treat `next dev` parity as a hackathon requirement.

From `web/`:

```powershell
npm install
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

Required local env:

```env
CONVEX_DEPLOYMENT=dev:fleet-curlew-675
NEXT_PUBLIC_CONVEX_URL=https://fleet-curlew-675.convex.cloud
FAL_KEY=optional_for_live_image_generation
```

`npm run convex:dev` and `npm run dev` are optional editing conveniences only. If they disagree with the production build path, prioritize `npm run build` and the Vercel deployment.

Do not commit `.env.local`, `.vercel`, `.next`, or `node_modules`.
