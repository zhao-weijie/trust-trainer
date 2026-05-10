import { ConvexHttpClient } from "convex/browser";

import { convexApi } from "./apiRefs";

export function getServerConvex() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  return new ConvexHttpClient(url);
}

export function isAuthorizedAdmin(request: Request): boolean {
  const expected = process.env.ADMIN_REVIEW_TOKEN;
  if (!expected) return false;
  const authorization = request.headers.get("authorization") ?? "";
  const bearer = authorization.toLowerCase().startsWith("bearer ") ? authorization.slice(7).trim() : "";
  const url = new URL(request.url);
  return bearer === expected || url.searchParams.get("key") === expected;
}

export { convexApi };
