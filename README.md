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

From `web/`:

```powershell
npm install
npm run convex:dev
npm run dev
```

Required local env:

```env
CONVEX_DEPLOYMENT=dev:fleet-curlew-675
NEXT_PUBLIC_CONVEX_URL=https://fleet-curlew-675.convex.cloud
```

Do not commit `.env.local`, `.vercel`, `.next`, or `node_modules`.
