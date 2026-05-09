import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

import { heuristicCheck, sanitizeSubmission } from "../src/lib/safety";
import { seedExamples } from "../src/lib/seeds";
import type {
  ApprovedDrill,
  Attempt,
  DatasetRow,
  DemoState,
  DrillDraft,
  DrillPrompt,
  ReviewQueueItem,
  ScamCheck,
  SeedExample,
  SubmissionArtifact,
  SourceKind,
  TeachingLabels
} from "../src/lib/types";
import { answerChoice, answerChoiceId, contentType, riskLevel, reviewStatus, scamStatus, scopeStatus } from "./validators";

type ReadCtx = QueryCtx | MutationCtx;

const DEMO_START = Date.UTC(2026, 4, 9, 0, 0, 0);

function demoTimestamp(offsetMinutes: number): string {
  return new Date(DEMO_START + offsetMinutes * 60_000).toISOString();
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);
  return slug || "submission";
}

function heuristicLabels(rawText: string): TeachingLabels {
  const labels = heuristicCheck(rawText);
  if (labels.scope_status === "in_scope_phishing_or_scam" && labels.scam_status === "verified_scam") {
    return { ...labels, scam_status: "suspected_scam" };
  }
  return labels;
}

function defaultPrompt(rawText: string, labels: TeachingLabels): DrillPrompt {
  const officialAction = labels.safest_action || "Use an official channel instead of the message link.";
  return {
    ...labels,
    scenario: `Someone in your family receives this message: "${rawText}"`,
    answer_choices: [
      { id: "A", text: "Follow the message instructions immediately." },
      { id: "B", text: officialAction },
      { id: "C", text: "Reply and ask the sender to prove it is real." },
      { id: "D", text: "Forward it to someone else to decide." }
    ],
    correct_answer: "B",
    explanation:
      labels.scope_status === "out_of_scope_spam"
        ? "This is outside the phishing/scam drill scope. Treat it as unwanted advertising, not a verified scam."
        : "The safest move is to pause and use a trusted official channel. This demo prefilter is not proof of a verified scam."
  };
}

function seedSourceKind(seed: SeedExample): SourceKind {
  if (seed.source_kind) {
    return seed.source_kind;
  }
  if (seed.source_dataset.includes("derived_pattern") || seed.source_dataset.includes("phiusiil")) {
    return "public_dataset";
  }
  if (seed.source_dataset.includes("provenance") || seed.source_dataset.includes("source_pack")) {
    return "provenance_pack";
  }
  return "synthetic_seed";
}

function queueItem(submission: Doc<"submissions">, draft: Doc<"drillDrafts">): ReviewQueueItem {
  return {
    id: submission.id,
    submitted_at: submission.submitted_at,
    content_type: submission.content_type,
    source_kind: submission.source_kind,
    source_dataset: submission.source_dataset,
    original_label: submission.original_label,
    raw_text: submission.raw_text,
    raw_asset_url: submission.raw_asset_url,
    pii_redacted_text: submission.pii_redacted_text,
    defanged_text: submission.defanged_text,
    redaction_notice_shown: submission.redaction_notice_shown,
    redaction_method: submission.redaction_method,
    scenario: draft.scenario,
    scam_status: draft.scam_status,
    scope_status: draft.scope_status,
    threat_type: draft.threat_type,
    risk_level: draft.risk_level,
    red_flags: draft.red_flags,
    safest_action: draft.safest_action,
    skeptical_claims: draft.skeptical_claims,
    skill_tags: draft.skill_tags,
    answer_choices: draft.answer_choices,
    correct_answer: draft.correct_answer,
    explanation: draft.explanation,
    review_status: draft.review_status,
    scam_check_id: draft.scam_check_id,
    draft_id: draft.id
  };
}

function approvedDrill(doc: Doc<"approvedDrills">): ApprovedDrill {
  return {
    id: doc.id,
    draft_id: doc.draft_id,
    submission_id: doc.submission_id,
    content_type: doc.content_type,
    source_dataset: doc.source_dataset,
    original_label: doc.original_label,
    published_at: doc.published_at,
    scenario: doc.scenario,
    scam_status: doc.scam_status,
    scope_status: doc.scope_status,
    threat_type: doc.threat_type,
    risk_level: doc.risk_level,
    red_flags: doc.red_flags,
    safest_action: doc.safest_action,
    skeptical_claims: doc.skeptical_claims,
    skill_tags: doc.skill_tags,
    answer_choices: doc.answer_choices,
    correct_answer: doc.correct_answer,
    explanation: doc.explanation
  };
}

function attempt(doc: Doc<"attempts">): Attempt {
  return {
    id: doc.id,
    drill_id: doc.drill_id,
    selected_answer: doc.selected_answer,
    is_correct: doc.is_correct,
    missed_skill_tags: doc.missed_skill_tags,
    created_at: doc.created_at
  };
}

function datasetRow(doc: Doc<"datasetRows">): DatasetRow {
  return {
    id: doc.id,
    submission_id: doc.submission_id,
    approved_drill_id: doc.approved_drill_id,
    content_type: doc.content_type,
    source_dataset: doc.source_dataset,
    original_label: doc.original_label,
    review_status: doc.review_status,
    scenario: doc.scenario,
    scam_status: doc.scam_status,
    scope_status: doc.scope_status,
    threat_type: doc.threat_type,
    risk_level: doc.risk_level,
    red_flags: doc.red_flags,
    safest_action: doc.safest_action,
    skeptical_claims: doc.skeptical_claims,
    skill_tags: doc.skill_tags,
    answer_choices: doc.answer_choices,
    correct_answer: doc.correct_answer,
    explanation: doc.explanation
  };
}

async function getSubmissionByDomainId(ctx: ReadCtx, id: string) {
  return await ctx.db
    .query("submissions")
    .withIndex("by_domain_id", (q) => q.eq("id", id))
    .unique();
}

async function getDraftByDomainId(ctx: ReadCtx, id: string) {
  return await ctx.db
    .query("drillDrafts")
    .withIndex("by_domain_id", (q) => q.eq("id", id))
    .unique();
}

async function clearTable(
  ctx: MutationCtx,
  table: "submissions" | "scamChecks" | "drillDrafts" | "approvedDrills" | "attempts" | "datasetRows"
) {
  const rows = await ctx.db.query(table).collect();
  for (const row of rows) {
    await ctx.db.delete(row._id);
  }
}

async function approveDraftDoc(
  ctx: MutationCtx,
  draft: Doc<"drillDrafts">,
  submission: Doc<"submissions">,
  publishedAt: string
) {
  const existing = await ctx.db
    .query("approvedDrills")
    .withIndex("by_draft_id", (q) => q.eq("draft_id", draft.id))
    .unique();

  const approved: ApprovedDrill = {
    id: `approved-${draft.id}`,
    draft_id: draft.id,
    submission_id: submission.id,
    content_type: submission.content_type,
    source_dataset: submission.source_dataset,
    original_label: submission.original_label,
    published_at: publishedAt,
    scenario: draft.scenario,
    scam_status: draft.scam_status,
    scope_status: draft.scope_status,
    threat_type: draft.threat_type,
    risk_level: draft.risk_level,
    red_flags: draft.red_flags,
    safest_action: draft.safest_action,
    skeptical_claims: draft.skeptical_claims,
    skill_tags: draft.skill_tags,
    answer_choices: draft.answer_choices,
    correct_answer: draft.correct_answer,
    explanation: draft.explanation
  };

  if (existing) {
    await ctx.db.patch(existing._id, approved);
  } else {
    await ctx.db.insert("approvedDrills", approved);
  }

  const existingRow = await ctx.db
    .query("datasetRows")
    .withIndex("by_approved_drill_id", (q) => q.eq("approved_drill_id", approved.id))
    .unique();

  const row: DatasetRow = {
    id: `dataset-${draft.id}`,
    submission_id: submission.id,
    approved_drill_id: approved.id,
    content_type: submission.content_type,
    source_dataset: submission.source_dataset,
    original_label: submission.original_label,
    review_status: "admin_approved",
    scenario: draft.scenario,
    scam_status: draft.scam_status,
    scope_status: draft.scope_status,
    threat_type: draft.threat_type,
    risk_level: draft.risk_level,
    red_flags: draft.red_flags,
    safest_action: draft.safest_action,
    skeptical_claims: draft.skeptical_claims,
    skill_tags: draft.skill_tags,
    answer_choices: draft.answer_choices,
    correct_answer: draft.correct_answer,
    explanation: draft.explanation
  };

  if (existingRow) {
    await ctx.db.patch(existingRow._id, row);
  } else {
    await ctx.db.insert("datasetRows", row);
  }

  await ctx.db.patch(draft._id, { review_status: "approved" });
  return approved;
}

async function insertSeed(ctx: MutationCtx, seed: SeedExample, index: number) {
  const redaction = sanitizeSubmission(seed.raw_text);
  const submittedAt = demoTimestamp(index);
  const submission: SubmissionArtifact & {
    pii_redacted_text: string;
    defanged_text: string;
    redaction_notice_shown: boolean;
    redaction_method: "browser_regex_demo";
  } = {
    id: `submission-${seed.id}`,
    submitted_at: submittedAt,
    content_type: seed.content_type,
    source_kind: seedSourceKind(seed),
    source_dataset: seed.source_dataset,
    original_label: seed.original_label,
    raw_text: seed.raw_text,
    pii_redacted_text: redaction.pii_redacted_text,
    defanged_text: redaction.defanged_text,
    redaction_notice_shown: true,
    redaction_method: "browser_regex_demo"
  };
  const submissionId = await ctx.db.insert("submissions", submission);
  const submissionDoc = await ctx.db.get(submissionId);
  if (!submissionDoc) {
    throw new Error("Seed submission insert failed");
  }

  const scamCheck: ScamCheck = {
    id: `check-${seed.id}`,
    submission_id: submission.id,
    checked_at: demoTimestamp(index + 1),
    check_source: "reviewed_seed_match",
    review_status: "admin_confirmed",
    scam_status: seed.scam_status,
    scope_status: seed.scope_status,
    threat_type: seed.threat_type,
    risk_level: seed.risk_level,
    red_flags: seed.red_flags,
    safest_action: seed.safest_action,
    skeptical_claims: seed.skeptical_claims,
    skill_tags: seed.skill_tags
  };
  await ctx.db.insert("scamChecks", scamCheck);

  const seededReviewStatus =
    seed.scope_status === "out_of_scope_spam" || seed.scope_status === "reject"
      ? "out_of_scope"
      : index < 10
        ? "pending_review"
        : "approved";

  const draft: DrillDraft = {
    id: `draft-${seed.id}`,
    submission_id: submission.id,
    scam_check_id: scamCheck.id,
    review_status: seededReviewStatus,
    draft_source: "seed",
    scenario: seed.scenario,
    scam_status: seed.scam_status,
    scope_status: seed.scope_status,
    threat_type: seed.threat_type,
    risk_level: seed.risk_level,
    red_flags: seed.red_flags,
    safest_action: seed.safest_action,
    skeptical_claims: seed.skeptical_claims,
    skill_tags: seed.skill_tags,
    answer_choices: seed.answer_choices,
    correct_answer: seed.correct_answer,
    explanation: seed.explanation
  };
  const draftId = await ctx.db.insert("drillDrafts", draft);

  if (draft.review_status === "approved") {
    const draftDoc = await ctx.db.get(draftId);
    if (!draftDoc) {
      throw new Error("Seed draft insert failed");
    }
    await approveDraftDoc(ctx, draftDoc, submissionDoc, demoTimestamp(index + 2));
  }
}

export const resetDemo = mutation({
  args: {},
  handler: async (ctx) => {
    await clearTable(ctx, "attempts");
    await clearTable(ctx, "datasetRows");
    await clearTable(ctx, "approvedDrills");
    await clearTable(ctx, "drillDrafts");
    await clearTable(ctx, "scamChecks");
    await clearTable(ctx, "submissions");
    return { ok: true };
  }
});

export const seedDemo = mutation({
  args: {},
  handler: async (ctx) => {
    await clearTable(ctx, "attempts");
    await clearTable(ctx, "datasetRows");
    await clearTable(ctx, "approvedDrills");
    await clearTable(ctx, "drillDrafts");
    await clearTable(ctx, "scamChecks");
    await clearTable(ctx, "submissions");

    for (let index = 0; index < seedExamples.length; index += 1) {
      await insertSeed(ctx, seedExamples[index], index * 3);
    }

    return { ok: true, seeded: seedExamples.length };
  }
});

export const submitContent = mutation({
  args: {
    raw_text: v.string(),
    content_type: contentType,
    raw_asset_url: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existingSubmissions = await ctx.db.query("submissions").collect();
    const sequence = existingSubmissions.length + 1;
    const submittedAt = demoTimestamp(500 + sequence);
    const redaction = sanitizeSubmission(args.raw_text);
    const labels = heuristicLabels(args.raw_text);
    const prompt = defaultPrompt(redaction.defanged_text, labels);
    const baseId = `${String(sequence).padStart(3, "0")}-${slugify(args.raw_text)}`;

    const submission = {
      id: `submission-user-${baseId}`,
      submitted_at: submittedAt,
      content_type: args.content_type,
      source_kind: "user_submission" as const,
      source_dataset: "reviewed_user_submission",
      original_label: "user_submitted_unverified",
      raw_text: args.raw_text,
      ...(args.raw_asset_url ? { raw_asset_url: args.raw_asset_url } : {}),
      pii_redacted_text: redaction.pii_redacted_text,
      defanged_text: redaction.defanged_text,
      redaction_notice_shown: true,
      redaction_method: "browser_regex_demo" as const
    };
    const submissionId = await ctx.db.insert("submissions", submission);
    const submissionDoc = await ctx.db.get(submissionId);
    if (!submissionDoc) {
      throw new Error("Submission insert failed");
    }

    const scamCheck: ScamCheck = {
      id: `check-user-${baseId}`,
      submission_id: submission.id,
      checked_at: demoTimestamp(501 + sequence),
      check_source: "heuristic_demo",
      review_status: "prefilter",
      ...labels
    };
    await ctx.db.insert("scamChecks", scamCheck);

    const draft: DrillDraft = {
      id: `draft-user-${baseId}`,
      submission_id: submission.id,
      scam_check_id: scamCheck.id,
      review_status: labels.scope_status === "out_of_scope_spam" || labels.scope_status === "reject" ? "out_of_scope" : "pending_review",
      draft_source: "heuristic_demo",
      ...prompt
    };
    const draftId = await ctx.db.insert("drillDrafts", draft);
    const draftDoc = await ctx.db.get(draftId);
    if (!draftDoc) {
      throw new Error("Draft insert failed");
    }

    return { submission: queueItem(submissionDoc, draftDoc) };
  }
});

export const listReviewQueue = query({
  args: {},
  handler: async (ctx): Promise<ReviewQueueItem[]> => {
    const drafts = await ctx.db.query("drillDrafts").collect();
    const queue = drafts.filter((draft) => draft.review_status === "prefilter" || draft.review_status === "pending_review");
    const items: ReviewQueueItem[] = [];

    for (const draft of queue) {
      const submission = await getSubmissionByDomainId(ctx, draft.submission_id);
      if (submission) {
        items.push(queueItem(submission, draft));
      }
    }

    return items.sort((a, b) => a.submitted_at.localeCompare(b.submitted_at));
  }
});

export const updateDraft = mutation({
  args: {
    draft_id: v.string(),
    review_status: v.optional(reviewStatus),
    draft_source: v.optional(v.union(v.literal("seed"), v.literal("heuristic_demo"), v.literal("llm_prefilter"), v.literal("admin"))),
    scenario: v.optional(v.string()),
    scam_status: v.optional(scamStatus),
    scope_status: v.optional(scopeStatus),
    threat_type: v.optional(v.string()),
    risk_level: v.optional(riskLevel),
    red_flags: v.optional(v.array(v.string())),
    safest_action: v.optional(v.string()),
    skeptical_claims: v.optional(v.array(v.string())),
    skill_tags: v.optional(v.array(v.string())),
    answer_choices: v.optional(v.array(answerChoice)),
    correct_answer: v.optional(answerChoiceId),
    explanation: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const draft = await getDraftByDomainId(ctx, args.draft_id);
    if (!draft) {
      throw new Error(`Draft not found: ${args.draft_id}`);
    }

    const patch: Partial<Doc<"drillDrafts">> = { draft_source: args.draft_source ?? "admin" };
    if (args.review_status !== undefined) patch.review_status = args.review_status;
    if (args.scenario !== undefined) patch.scenario = args.scenario;
    if (args.scam_status !== undefined) patch.scam_status = args.scam_status;
    if (args.scope_status !== undefined) patch.scope_status = args.scope_status;
    if (args.threat_type !== undefined) patch.threat_type = args.threat_type;
    if (args.risk_level !== undefined) patch.risk_level = args.risk_level;
    if (args.red_flags !== undefined) patch.red_flags = args.red_flags;
    if (args.safest_action !== undefined) patch.safest_action = args.safest_action;
    if (args.skeptical_claims !== undefined) patch.skeptical_claims = args.skeptical_claims;
    if (args.skill_tags !== undefined) patch.skill_tags = args.skill_tags;
    if (args.answer_choices !== undefined) patch.answer_choices = args.answer_choices;
    if (args.correct_answer !== undefined) patch.correct_answer = args.correct_answer;
    if (args.explanation !== undefined) patch.explanation = args.explanation;
    await ctx.db.patch(draft._id, patch);

    const updated = await ctx.db.get(draft._id);
    return updated;
  }
});

export const approveDraft = mutation({
  args: {
    draft_id: v.string()
  },
  handler: async (ctx, args) => {
    const draft = await getDraftByDomainId(ctx, args.draft_id);
    if (!draft) {
      throw new Error(`Draft not found: ${args.draft_id}`);
    }
    if (draft.scope_status === "out_of_scope_spam" || draft.scope_status === "reject") {
      throw new Error("Out-of-scope or rejected drafts cannot be approved as playable drills.");
    }
    const submission = await getSubmissionByDomainId(ctx, draft.submission_id);
    if (!submission) {
      throw new Error(`Submission not found: ${draft.submission_id}`);
    }

    return await approveDraftDoc(ctx, draft, submission, demoTimestamp(900 + (await ctx.db.query("approvedDrills").collect()).length));
  }
});

export const rejectDraft = mutation({
  args: {
    draft_id: v.string(),
    reason: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const draft = await getDraftByDomainId(ctx, args.draft_id);
    if (!draft) {
      throw new Error(`Draft not found: ${args.draft_id}`);
    }
    await ctx.db.patch(draft._id, {
      review_status: "rejected",
      skeptical_claims: args.reason ? [...draft.skeptical_claims, args.reason] : draft.skeptical_claims
    });
    return { ok: true };
  }
});

export const markOutOfScope = mutation({
  args: {
    draft_id: v.string(),
    reason: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const draft = await getDraftByDomainId(ctx, args.draft_id);
    if (!draft) {
      throw new Error(`Draft not found: ${args.draft_id}`);
    }
    await ctx.db.patch(draft._id, {
      review_status: "out_of_scope",
      scope_status: "out_of_scope_spam",
      scam_status: "legitimate",
      threat_type: "generic_spam",
      risk_level: "low",
      skeptical_claims: args.reason ? [...draft.skeptical_claims, args.reason] : draft.skeptical_claims
    });
    return { ok: true };
  }
});

export const listApprovedDrills = query({
  args: {},
  handler: async (ctx): Promise<ApprovedDrill[]> => {
    const docs = await ctx.db.query("approvedDrills").collect();
    return docs.map(approvedDrill).sort((a, b) => a.published_at.localeCompare(b.published_at));
  }
});

export const getApprovedDrill = query({
  args: {
    id: v.string()
  },
  handler: async (ctx, args): Promise<ApprovedDrill | null> => {
    const doc = await ctx.db
      .query("approvedDrills")
      .withIndex("by_domain_id", (q) => q.eq("id", args.id))
      .unique();
    return doc ? approvedDrill(doc) : null;
  }
});

export const recordAttempt = mutation({
  args: {
    drill_id: v.string(),
    selected_answer: answerChoiceId
  },
  handler: async (ctx, args): Promise<Attempt> => {
    const drill = await ctx.db
      .query("approvedDrills")
      .withIndex("by_domain_id", (q) => q.eq("id", args.drill_id))
      .unique();
    if (!drill) {
      throw new Error(`Approved drill not found: ${args.drill_id}`);
    }

    const existingAttempts = await ctx.db.query("attempts").collect();
    const isCorrect = args.selected_answer === drill.correct_answer;
    const doc: Attempt = {
      id: `attempt-${String(existingAttempts.length + 1).padStart(3, "0")}`,
      drill_id: args.drill_id,
      selected_answer: args.selected_answer,
      is_correct: isCorrect,
      missed_skill_tags: isCorrect ? [] : drill.skill_tags,
      created_at: demoTimestamp(1_000 + existingAttempts.length)
    };
    await ctx.db.insert("attempts", doc);
    return doc;
  }
});

export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const [submissions, drafts, approved, attempts, datasetRows] = await Promise.all([
      ctx.db.query("submissions").collect(),
      ctx.db.query("drillDrafts").collect(),
      ctx.db.query("approvedDrills").collect(),
      ctx.db.query("attempts").collect(),
      ctx.db.query("datasetRows").collect()
    ]);

    const skillMisses: Record<string, number> = {};
    for (const row of attempts) {
      for (const tag of row.missed_skill_tags) {
        skillMisses[tag] = (skillMisses[tag] ?? 0) + 1;
      }
    }

    const threatTypes: Record<string, number> = {};
    const riskLevels: Record<string, number> = {};
    for (const drill of approved) {
      threatTypes[drill.threat_type] = (threatTypes[drill.threat_type] ?? 0) + 1;
      riskLevels[drill.risk_level] = (riskLevels[drill.risk_level] ?? 0) + 1;
    }

    const correctAttempts = attempts.filter((row) => row.is_correct).length;
    const pendingReview = drafts.filter((draft) => draft.review_status === "prefilter" || draft.review_status === "pending_review").length;

    return {
      submissions: submissions.length,
      pendingReview,
      approvedDrills: approved.length,
      datasetRows: datasetRows.length,
      attempts: attempts.length,
      correctAttempts,
      accuracy: attempts.length === 0 ? 0 : Math.round((correctAttempts / attempts.length) * 100),
      skillMisses,
      threatTypes,
      riskLevels
    };
  }
});

export const getDemoState = query({
  args: {},
  handler: async (ctx): Promise<DemoState> => {
    const drafts = await ctx.db.query("drillDrafts").collect();
    const submissions: ReviewQueueItem[] = [];

    for (const draft of drafts) {
      const submission = await getSubmissionByDomainId(ctx, draft.submission_id);
      if (submission) {
        submissions.push(queueItem(submission, draft));
      }
    }

    const approved = await ctx.db.query("approvedDrills").collect();
    const attempts = await ctx.db.query("attempts").collect();
    const datasetRows = await ctx.db.query("datasetRows").collect();

    return {
      submissions: submissions.sort((a, b) => a.submitted_at.localeCompare(b.submitted_at)),
      approvedDrills: approved.map(approvedDrill).sort((a, b) => a.published_at.localeCompare(b.published_at)),
      attempts: attempts.map(attempt).sort((a, b) => a.created_at.localeCompare(b.created_at)),
      datasetRows: datasetRows.map(datasetRow)
    };
  }
});
