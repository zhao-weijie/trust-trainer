import { NextResponse } from "next/server";

import { convexApi, getServerConvex, isAuthorizedAdmin } from "@/lib/serverConvex";

export async function GET(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getServerConvex();
  const drafts = await client.query(convexApi.app.listPendingDrafts, {});
  return NextResponse.json({ drafts });
}
