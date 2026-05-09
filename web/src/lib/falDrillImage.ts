import { normalizeList } from "@/lib/safety";
import type { ReviewQueueItem } from "@/lib/types";

export type GenerateDrillImageRequest = {
  defanged_text: string;
  scenario: string;
  threat_type: string;
  red_flags: string[];
  safest_action: string;
  seed_image_url?: string;
};

export type GenerateDrillImageResponse = {
  configured: boolean;
  provider?: "fal";
  model?: "fal-ai/nano-banana-2/edit";
  imageUrl?: string;
  requestId?: string;
  prompt?: string;
  seedImageUrl?: string;
  error?: string;
};

export type DrillImageDraftInput = {
  scenario: string;
  threat_type: string;
  red_flags: string | string[];
  safest_action: string;
};

export function buildDrillImageRequest(
  item: Pick<ReviewQueueItem, "defanged_text">,
  draft: DrillImageDraftInput
): GenerateDrillImageRequest {
  return {
    defanged_text: item.defanged_text.trim(),
    scenario: draft.scenario.trim(),
    threat_type: draft.threat_type.trim(),
    red_flags: Array.isArray(draft.red_flags)
      ? draft.red_flags.map((flag) => flag.trim()).filter(Boolean)
      : normalizeList(draft.red_flags),
    safest_action: draft.safest_action.trim()
  };
}
