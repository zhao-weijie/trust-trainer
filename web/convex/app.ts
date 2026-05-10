import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { quizValidator } from "./schema";
import { buildFallbackQuiz } from "../src/lib/drill";

const submissionResult = v.union(v.literal("confirmed_scam"), v.literal("suspected_scam"), v.literal("legitimate"));

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function draftById(ctx: MutationCtx, draftId: string) {
  return await ctx.db
    .query("drillDrafts")
    .withIndex("by_domain_id", (q) => q.eq("id", draftId))
    .unique();
}

export const submitScreenshot = mutation({
  args: {
    baked_image_data_url: v.string(),
    ocr_text: v.string(),
    redacted_text: v.string(),
    defanged_text: v.string(),
    result: submissionResult,
    redaction_boxes: v.array(
      v.object({
        text: v.string(),
        reason: v.string(),
        redacted: v.boolean()
      })
    )
  },
  handler: async (ctx, args) => {
    const createdAt = now();
    const submissionId = makeId("submission");
    const draftId = makeId("draft");

    await ctx.db.insert("submissions", {
      id: submissionId,
      created_at: createdAt,
      baked_image_data_url: args.baked_image_data_url,
      ocr_text: args.ocr_text,
      redacted_text: args.redacted_text,
      defanged_text: args.defanged_text,
      result: args.result,
      review_status: "pending",
      redaction_boxes: args.redaction_boxes
    });

    await ctx.db.insert("drillDrafts", {
      id: draftId,
      submission_id: submissionId,
      created_at: createdAt,
      review_status: "pending",
      quiz: buildFallbackQuiz(args.defanged_text, args.result)
    });

    return {
      submission_id: submissionId,
      draft_id: draftId,
      result: args.result
    };
  }
});

export const listPendingDrafts = query({
  args: {},
  handler: async (ctx) => {
    const drafts = await ctx.db
      .query("drillDrafts")
      .withIndex("by_review_status", (q) => q.eq("review_status", "pending"))
      .collect();

    const results = [];
    for (const draft of drafts) {
      const submission = await ctx.db
        .query("submissions")
        .withIndex("by_domain_id", (q) => q.eq("id", draft.submission_id))
        .unique();
      results.push({ draft, submission });
    }
    return results;
  }
});

export const updateDraft = mutation({
  args: {
    draft_id: v.string(),
    quiz: quizValidator,
    generated_asset_url: v.optional(v.string()),
    generated_asset_prompt: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const draft = await draftById(ctx, args.draft_id);
    if (!draft) throw new Error(`Draft not found: ${args.draft_id}`);

    await ctx.db.patch(draft._id, {
      quiz: args.quiz,
      ...(args.generated_asset_url ? { generated_asset_url: args.generated_asset_url } : {}),
      ...(args.generated_asset_prompt ? { generated_asset_prompt: args.generated_asset_prompt } : {})
    });

    return await ctx.db.get(draft._id);
  }
});

export const approveDraft = mutation({
  args: {
    draft_id: v.string()
  },
  handler: async (ctx, args) => {
    const draft = await draftById(ctx, args.draft_id);
    if (!draft) throw new Error(`Draft not found: ${args.draft_id}`);

    const publishedAt = now();
    const existing = await ctx.db
      .query("approvedDrills")
      .withIndex("by_draft_id", (q) => q.eq("draft_id", draft.id))
      .unique();

    const approved = {
      id: existing?.id ?? makeId("approved"),
      draft_id: draft.id,
      submission_id: draft.submission_id,
      published_at: publishedAt,
      quiz: draft.quiz,
      ...(draft.generated_asset_url ? { generated_asset_url: draft.generated_asset_url } : {}),
      ...(draft.generated_asset_prompt ? { generated_asset_prompt: draft.generated_asset_prompt } : {})
    };

    if (existing) {
      await ctx.db.patch(existing._id, approved);
    } else {
      await ctx.db.insert("approvedDrills", approved);
    }

    await ctx.db.patch(draft._id, { review_status: "approved" });
    const submission = await ctx.db
      .query("submissions")
      .withIndex("by_domain_id", (q) => q.eq("id", draft.submission_id))
      .unique();
    if (submission) await ctx.db.patch(submission._id, { review_status: "approved" });

    return approved;
  }
});

export const rejectDraft = mutation({
  args: {
    draft_id: v.string(),
    reason: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const draft = await draftById(ctx, args.draft_id);
    if (!draft) throw new Error(`Draft not found: ${args.draft_id}`);
    await ctx.db.patch(draft._id, { review_status: "rejected" });
    const submission = await ctx.db
      .query("submissions")
      .withIndex("by_domain_id", (q) => q.eq("id", draft.submission_id))
      .unique();
    if (submission) await ctx.db.patch(submission._id, { review_status: "rejected" });
    return { ok: true, reason: args.reason };
  }
});

export const listApprovedDrills = query({
  args: {},
  handler: async (ctx) => {
    const drills = await ctx.db.query("approvedDrills").collect();
    return drills
      .sort((a, b) => a.published_at.localeCompare(b.published_at))
      .map((drill) => ({
        id: drill.id,
        quiz: drill.quiz,
        generated_asset_url: drill.generated_asset_url
      }));
  }
});
