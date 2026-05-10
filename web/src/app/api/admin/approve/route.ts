import { NextResponse } from "next/server";

import { convexApi, getServerConvex, isAuthorizedAdmin } from "@/lib/serverConvex";

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { draft_id?: string };
  if (!body.draft_id) {
    return NextResponse.json({ error: "draft_id is required" }, { status: 400 });
  }

  const client = getServerConvex();
  const approved = await client.mutation(convexApi.app.approveDraft, { draft_id: body.draft_id });
  return NextResponse.json({ approved });
}
