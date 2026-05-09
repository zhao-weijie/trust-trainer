export type ContentType = "email" | "sms" | "whatsapp" | "url" | "social_post" | "screenshot";

export type SourceKind = "user_submission" | "synthetic_seed" | "public_dataset" | "provenance_pack";

export type ScamStatus = "verified_scam" | "suspected_scam" | "legitimate";

export type ScopeStatus =
  | "in_scope_phishing_or_scam"
  | "benign_contrast"
  | "out_of_scope_spam"
  | "reject";

export type RiskLevel = "low" | "medium" | "high";

export type ReviewStatus = "prefilter" | "pending_review" | "approved" | "rejected" | "out_of_scope";

export type AnswerChoiceId = "A" | "B" | "C" | "D";

export type AnswerChoice = {
  id: AnswerChoiceId;
  text: string;
};

export type TeachingLabels = {
  scam_status: ScamStatus;
  scope_status: ScopeStatus;
  threat_type: string;
  risk_level: RiskLevel;
  red_flags: string[];
  safest_action: string;
  skeptical_claims: string[];
  skill_tags: string[];
};

export type SubmissionArtifact = {
  id: string;
  submitted_at: string;
  content_type: ContentType;
  source_kind: SourceKind;
  source_dataset: string;
  original_label: string;
  raw_text: string;
  raw_asset_url?: string;
};

export type RedactionResult = {
  pii_redacted_text: string;
  defanged_text: string;
  redaction_notice_shown: boolean;
  redaction_method: "browser_regex_demo" | "privacy_filter" | "manual_admin";
};

export type ScamCheck = TeachingLabels & {
  id: string;
  submission_id: string;
  checked_at: string;
  check_source: "heuristic_demo" | "llm_prefilter" | "reviewed_seed_match";
  review_status: "prefilter" | "admin_confirmed" | "admin_corrected";
};

export type DrillPrompt = TeachingLabels & {
  scenario: string;
  answer_choices: AnswerChoice[];
  correct_answer: AnswerChoiceId;
  explanation: string;
};

export type DrillDraft = DrillPrompt & {
  id: string;
  submission_id: string;
  scam_check_id: string;
  review_status: ReviewStatus;
  draft_source: "seed" | "heuristic_demo" | "llm_prefilter" | "admin";
};

export type ApprovedDrill = DrillPrompt & {
  id: string;
  draft_id: string;
  submission_id: string;
  content_type: ContentType;
  source_dataset: string;
  original_label: string;
  published_at: string;
};

export type ReviewQueueItem = SubmissionArtifact &
  RedactionResult &
  DrillPrompt & {
    review_status: ReviewStatus;
    scam_check_id: string;
    draft_id: string;
  };

export type SeedExample = DrillPrompt & {
  id: string;
  content_type: ContentType;
  source_kind?: SourceKind;
  source_dataset: string;
  original_label: string;
  raw_text: string;
};

export type Attempt = {
  id: string;
  drill_id: string;
  selected_answer: AnswerChoiceId;
  is_correct: boolean;
  missed_skill_tags: string[];
  created_at: string;
};

export type DatasetRow = DrillPrompt & {
  id: string;
  submission_id: string;
  approved_drill_id: string;
  content_type: ContentType;
  source_dataset: string;
  original_label: string;
  review_status: "admin_approved";
};

export type DemoState = {
  submissions: ReviewQueueItem[];
  approvedDrills: ApprovedDrill[];
  attempts: Attempt[];
  datasetRows: DatasetRow[];
};

export type Submission = ReviewQueueItem;
