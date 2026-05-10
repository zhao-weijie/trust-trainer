import { NextResponse } from "next/server";

import { convexApi, getServerConvex, isAuthorizedAdmin } from "@/lib/serverConvex";
import type { DrillQuiz } from "@/lib/drill";

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    draft_id?: string;
    quiz?: DrillQuiz;
    generated_asset_url?: string;
    generated_asset_prompt?: string;
  };

  if (!body.draft_id || !body.quiz) {
    return NextResponse.json({ error: "draft_id and quiz are required" }, { status: 400 });
  }

  const client = getServerConvex();
  const draft = await client.mutation(convexApi.app.updateDraft, {
    draft_id: body.draft_id,
    quiz: body.quiz,
    generated_asset_url: body.generated_asset_url,
    generated_asset_prompt: body.generated_asset_prompt
  });
  return NextResponse.json({ draft });
}
