import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type GenerateImageRequest = {
  scenario?: string;
  threat_type?: string;
  safest_action?: string;
  red_flags?: string[];
};

function seedFromText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function buildFalPrompt(body: GenerateImageRequest): string {
  const redFlags = body.red_flags?.filter(Boolean).slice(0, 3).join(", ") || "urgent pressure, unsafe link";
  const scenario = body.scenario?.trim() || "A suspicious delivery-fee scam message";
  const safestAction = body.safest_action?.trim() || "Open the official app or website directly.";

  return [
    "Create a safe synthetic educational image for a family scam-literacy drill.",
    "Show a modern phone screenshot-style chat card, not a real app clone.",
    "Use fictional sender names only. Do not include real brands, real phone numbers, QR codes, or clickable URLs.",
    "If text is shown, make it clearly fake and use defanged placeholder links like hxxps://example[.]test.",
    `Scenario: ${scenario}`,
    `Threat type: ${body.threat_type || "phishing_or_scam"}.`,
    `Visual red flags to imply: ${redFlags}.`,
    `Teaching outcome: ${safestAction}`,
    "The image should look like a reviewed training artifact, not an operational scam."
  ].join(" ");
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

  const body = (await request.json()) as GenerateImageRequest;
  const prompt = buildFalPrompt(body);
  fal.config({ credentials: process.env.FAL_KEY });

  const result = await fal.subscribe("fal-ai/nano-banana-2", {
    input: {
      prompt,
      num_images: 1,
      aspect_ratio: "4:5",
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
    model: "fal-ai/nano-banana-2",
    imageUrl,
    requestId: result.requestId,
    prompt
  });
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.FAL_KEY),
    provider: "fal",
    model: "fal-ai/nano-banana-2"
  });
}
