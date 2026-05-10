import { fal } from "@fal-ai/client";
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

import type { DrillQuiz } from "@/lib/drill";

export const runtime = "nodejs";

const seedPath = path.join(process.cwd(), "public", "fal-seeds", "messenger-scam-template.png");

function compact(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function buildPrompt(quiz: DrillQuiz) {
  return [
    "Create a safe scam-literacy infographic for a family training drill.",
    "Use clear warning-sign callouts, simple icons, and readable text.",
    "Do not create a usable scam, QR code, live URL, real bank page, real agency page, or real brand impersonation.",
    `Scenario: ${compact(quiz.scenario).slice(0, 500)}`,
    `Threat type: ${quiz.threat_type}.`,
    `Warning signs: ${quiz.red_flags.join(", ")}.`,
    `Safest action: ${quiz.safest_action}.`
  ].join(" ");
}

async function uploadSeed() {
  const seed = await readFile(seedPath);
  const file = new File([seed], "messenger-scam-template.png", { type: "image/png" });
  return await fal.storage.upload(file);
}

function imageUrlFromResult(result: unknown): string | null {
  if (!result || typeof result !== "object" || !("data" in result)) return null;
  const data = (result as { data?: { images?: Array<{ url?: string }> } }).data;
  return data?.images?.[0]?.url ?? null;
}

export async function POST(request: Request) {
  if (!process.env.FAL_KEY) {
    return NextResponse.json({ configured: false, error: "FAL_KEY is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { quiz?: DrillQuiz; seed_image_url?: string };
    if (!body.quiz) {
      return NextResponse.json({ configured: true, error: "quiz is required." }, { status: 400 });
    }

    fal.config({ credentials: process.env.FAL_KEY });
    const prompt = buildPrompt(body.quiz);
    const seedImageUrl = body.seed_image_url || (await uploadSeed());
    const result = await fal.subscribe("fal-ai/nano-banana-2/edit", {
      input: {
        prompt,
        image_urls: [seedImageUrl],
        num_images: 1,
        output_format: "png",
        resolution: "1K",
        safety_tolerance: "2",
        limit_generations: true
      }
    });
    const imageUrl = imageUrlFromResult(result);
    if (!imageUrl) {
      return NextResponse.json({ configured: true, error: "fal returned no image URL." }, { status: 502 });
    }
    return NextResponse.json({
      configured: true,
      provider: "fal",
      model: "fal-ai/nano-banana-2/edit",
      imageUrl,
      requestId: result.requestId,
      prompt,
      seedImageUrl
    });
  } catch (caught) {
    return NextResponse.json(
      { configured: true, error: caught instanceof Error ? caught.message : "fal image generation failed." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.FAL_KEY),
    provider: "fal",
    seed: "/fal-seeds/messenger-scam-template.png"
  });
}
