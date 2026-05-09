import { v } from "convex/values";

export const contentType = v.union(
  v.literal("email"),
  v.literal("sms"),
  v.literal("whatsapp"),
  v.literal("url"),
  v.literal("social_post"),
  v.literal("screenshot")
);

export const sourceKind = v.union(
  v.literal("user_submission"),
  v.literal("synthetic_seed"),
  v.literal("public_dataset"),
  v.literal("provenance_pack")
);

export const scamStatus = v.union(v.literal("verified_scam"), v.literal("suspected_scam"), v.literal("legitimate"));

export const scopeStatus = v.union(
  v.literal("in_scope_phishing_or_scam"),
  v.literal("benign_contrast"),
  v.literal("out_of_scope_spam"),
  v.literal("reject")
);

export const riskLevel = v.union(v.literal("low"), v.literal("medium"), v.literal("high"));

export const reviewStatus = v.union(
  v.literal("prefilter"),
  v.literal("pending_review"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("out_of_scope")
);

export const answerChoiceId = v.union(v.literal("A"), v.literal("B"), v.literal("C"), v.literal("D"));

export const answerChoice = v.object({
  id: answerChoiceId,
  text: v.string()
});

export const teachingLabels = {
  scam_status: scamStatus,
  scope_status: scopeStatus,
  threat_type: v.string(),
  risk_level: riskLevel,
  red_flags: v.array(v.string()),
  safest_action: v.string(),
  skeptical_claims: v.array(v.string()),
  skill_tags: v.array(v.string())
};

export const drillPrompt = {
  ...teachingLabels,
  scenario: v.string(),
  answer_choices: v.array(answerChoice),
  correct_answer: answerChoiceId,
  explanation: v.string()
};

export const generatedAsset = {
  generated_asset_url: v.optional(v.string()),
  generated_asset_request_id: v.optional(v.string()),
  generated_asset_provider: v.optional(v.literal("fal")),
  generated_asset_prompt: v.optional(v.string())
};
