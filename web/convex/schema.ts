import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const submissionResult = v.union(v.literal("confirmed_scam"), v.literal("suspected_scam"), v.literal("legitimate"));
const reviewStatus = v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"));
const answerId = v.union(v.literal("A"), v.literal("B"), v.literal("C"), v.literal("D"));

export const quizValidator = v.object({
  scenario: v.string(),
  result: submissionResult,
  threat_type: v.string(),
  risk_level: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  red_flags: v.array(v.string()),
  safest_action: v.string(),
  skill_tags: v.array(v.string()),
  answer_choices: v.array(v.object({ id: answerId, text: v.string() })),
  correct_answer: answerId,
  explanation: v.string(),
  infographic_prompt: v.string()
});

export default defineSchema({
  submissions: defineTable({
    id: v.string(),
    created_at: v.string(),
    baked_image_data_url: v.string(),
    ocr_text: v.string(),
    redacted_text: v.string(),
    defanged_text: v.string(),
    result: submissionResult,
    review_status: reviewStatus,
    redaction_boxes: v.array(
      v.object({
        text: v.string(),
        reason: v.string(),
        redacted: v.boolean()
      })
    )
  })
    .index("by_domain_id", ["id"])
    .index("by_created_at", ["created_at"])
    .index("by_review_status", ["review_status"]),

  drillDrafts: defineTable({
    id: v.string(),
    submission_id: v.string(),
    created_at: v.string(),
    review_status: reviewStatus,
    quiz: quizValidator,
    generated_asset_url: v.optional(v.string()),
    generated_asset_prompt: v.optional(v.string())
  })
    .index("by_domain_id", ["id"])
    .index("by_submission_id", ["submission_id"])
    .index("by_review_status", ["review_status"]),

  approvedDrills: defineTable({
    id: v.string(),
    draft_id: v.string(),
    submission_id: v.string(),
    published_at: v.string(),
    quiz: quizValidator,
    generated_asset_url: v.optional(v.string()),
    generated_asset_prompt: v.optional(v.string())
  })
    .index("by_domain_id", ["id"])
    .index("by_draft_id", ["draft_id"])
    .index("by_published_at", ["published_at"])
});
