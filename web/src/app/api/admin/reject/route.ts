import { NextResponse } from "next/server";

import { convexApi, getServerConvex, isAuthorizedAdmin } from "@/lib/serverConvex";

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { draft_id?: string; reason?: string };
  if (!body.draft_id) {
    return NextResponse.json({ error: "draft_id is required" }, { status: 400 });
  }

  const client = getServerConvex();
  const rejected = await client.mutation(convexApi.app.rejectDraft, {
    draft_id: body.draft_id,
    reason: body.reason
  });
  return NextResponse.json({ rejected });
}
