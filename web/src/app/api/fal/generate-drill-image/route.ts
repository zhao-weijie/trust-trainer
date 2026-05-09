import { fal } from "@fal-ai/client";
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import type { GenerateDrillImageRequest } from "@/lib/falDrillImage";

export const runtime = "nodejs";

const localSeedImagePath = path.join(process.cwd(), "public", "fal-seeds", "messenger-scam-template.png");

function seedFromText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function compactPromptText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function buildFalEditPrompt(body: Partial<GenerateDrillImageRequest>): string {
  const redFlags = body.red_flags?.filter(Boolean).slice(0, 3).join(", ") || "urgent pressure, unsafe link";
  const scenario = compactPromptText(body.scenario ?? "") || "A suspicious delivery-fee scam message";
  const safestAction = compactPromptText(body.safest_action ?? "") || "Open the official app or website directly.";
  const submittedScamText = compactPromptText(body.defanged_text ?? "") || "A defanged suspicious message submitted for review.";

  return [
    "Edit the seed image into a realistic but clearly synthetic scam-literacy training screenshot.",
    "Preserve the seed image's phone screenshot composition, chat-message spacing, status bar, and messaging-app feel.",
    "Replace the visible account name, profile details, and message copy so they match the submitted scam text below.",
    "Use fictional logos, fictional institutions, and placeholder names only. Do not use real brands, real agencies, real IDs, real phone numbers, QR codes, or clickable URLs.",
    "If any URL appears, it must be defanged and fictional, for example hxxps://example[.]test.",
    "Do not reconstruct defanged URLs into live URLs.",
    "Keep the artifact plausible enough for education, but avoid making it operationally useful for fraud.",
    `Submitted scam text: "${submittedScamText}"`,
    `Scenario: ${scenario}`,
    `Threat type: ${body.threat_type || "phishing_or_scam"}.`,
    `Red flags to make visible or implied: ${redFlags}.`,
    `Teaching outcome: ${safestAction}`,
    "Return a single edited image."
  ].join(" ");
}

async function defaultSeedImageUrl(): Promise<string> {
  const seedImage = await readFile(localSeedImagePath);
  const file = new File([seedImage], "messenger-scam-template.png", { type: "image/png" });
  return await fal.storage.upload(file);
}

function imageUrlFromResult(result: unknown): string | null {
  if (!result || typeof result !== "object" || !("data" in result)) return null;
  const data = (result as { data?: unknown }).data;
  if (!data || typeof data !== "object" || !("images" in data)) return null;
  const images = (data as { images?: unknown }).images;
  if (!Array.isArray(images)) return null;
  const first = images[0];
  if (!first || typeof first !== "object" || !("url" in first)) return null;
  const url = (first as { url?: unknown }).url;
  return typeof url === "string" ? url : null;
}

export async function POST(request: Request) {
  if (!process.env.FAL_KEY) {
    return NextResponse.json(
      { configured: false, error: "FAL_KEY is not configured. Text-only demo mode is still available." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as Partial<GenerateDrillImageRequest>;
    const prompt = buildFalEditPrompt(body);
    fal.config({ credentials: process.env.FAL_KEY });
    const seedImageUrl = body.seed_image_url?.trim() || (await defaultSeedImageUrl());

    const result = await fal.subscribe("fal-ai/nano-banana-2/edit", {
      input: {
        prompt,
        image_urls: [seedImageUrl],
        num_images: 1,
        aspect_ratio: "auto",
        output_format: "png",
        safety_tolerance: "2",
        resolution: "1K",
        limit_generations: true,
        seed: seedFromText(prompt)
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
      {
        configured: true,
        error: caught instanceof Error ? caught.message : "fal image edit failed."
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.FAL_KEY),
    provider: "fal",
    model: "fal-ai/nano-banana-2/edit",
    seed: "/fal-seeds/messenger-scam-template.png"
  });
}
