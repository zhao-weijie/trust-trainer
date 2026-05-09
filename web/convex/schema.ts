import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { contentType, drillPrompt, reviewStatus, sourceKind, teachingLabels } from "./validators";

export default defineSchema({
  submissions: defineTable({
    id: v.string(),
    submitted_at: v.string(),
    content_type: contentType,
    source_kind: sourceKind,
    source_dataset: v.string(),
    original_label: v.string(),
    raw_text: v.string(),
    raw_asset_url: v.optional(v.string()),
    pii_redacted_text: v.string(),
    defanged_text: v.string(),
    redaction_notice_shown: v.boolean(),
    redaction_method: v.union(v.literal("browser_regex_demo"), v.literal("privacy_filter"), v.literal("manual_admin"))
  })
    .index("by_domain_id", ["id"])
    .index("by_submitted_at", ["submitted_at"])
    .index("by_source_kind", ["source_kind"]),

  scamChecks: defineTable({
    ...teachingLabels,
    id: v.string(),
    submission_id: v.string(),
    checked_at: v.string(),
    check_source: v.union(v.literal("heuristic_demo"), v.literal("llm_prefilter"), v.literal("reviewed_seed_match")),
    review_status: v.union(v.literal("prefilter"), v.literal("admin_confirmed"), v.literal("admin_corrected"))
  })
    .index("by_domain_id", ["id"])
    .index("by_submission_id", ["submission_id"]),

  drillDrafts: defineTable({
    ...drillPrompt,
    id: v.string(),
    submission_id: v.string(),
    scam_check_id: v.string(),
    review_status: reviewStatus,
    draft_source: v.union(v.literal("seed"), v.literal("heuristic_demo"), v.literal("llm_prefilter"), v.literal("admin"))
  })
    .index("by_domain_id", ["id"])
    .index("by_submission_id", ["submission_id"])
    .index("by_review_status", ["review_status"]),

  approvedDrills: defineTable({
    ...drillPrompt,
    id: v.string(),
    draft_id: v.string(),
    submission_id: v.string(),
    content_type: contentType,
    source_dataset: v.string(),
    original_label: v.string(),
    published_at: v.string()
  })
    .index("by_domain_id", ["id"])
    .index("by_draft_id", ["draft_id"])
    .index("by_published_at", ["published_at"]),

  attempts: defineTable({
    id: v.string(),
    drill_id: v.string(),
    selected_answer: v.union(v.literal("A"), v.literal("B"), v.literal("C"), v.literal("D")),
    is_correct: v.boolean(),
    missed_skill_tags: v.array(v.string()),
    created_at: v.string()
  })
    .index("by_domain_id", ["id"])
    .index("by_drill_id", ["drill_id"])
    .index("by_created_at", ["created_at"]),

  datasetRows: defineTable({
    ...drillPrompt,
    id: v.string(),
    submission_id: v.string(),
    approved_drill_id: v.string(),
    content_type: contentType,
    source_dataset: v.string(),
    original_label: v.string(),
    review_status: v.literal("admin_approved")
  })
    .index("by_domain_id", ["id"])
    .index("by_approved_drill_id", ["approved_drill_id"])
});

