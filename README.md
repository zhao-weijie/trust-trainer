# Trust Trainer

Trust Trainer turns suspicious digital content into human-reviewed family safety drills.

Public demo:

```text
https://web-one-rho-kt48p1kwl2.vercel.app
```

Core demo path:

```text
/submit -> /admin -> /challenge/[id] -> /dashboard
```

The app uses Convex shared state and deterministic demo heuristics. User-submitted content is redacted and suspicious URLs are defanged before analysis or display.

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
```

`npm run convex:dev` and `npm run dev` are optional editing conveniences only. If they disagree with the production build path, prioritize `npm run build` and the Vercel deployment.

Do not commit `.env.local`, `.vercel`, `.next`, or `node_modules`.
