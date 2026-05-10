import { makeFunctionReference } from "convex/server";

export const convexApi = {
  app: {
    submitScreenshot: makeFunctionReference<"mutation">("app:submitScreenshot"),
    listPendingDrafts: makeFunctionReference<"query">("app:listPendingDrafts"),
    updateDraft: makeFunctionReference<"mutation">("app:updateDraft"),
    approveDraft: makeFunctionReference<"mutation">("app:approveDraft"),
    rejectDraft: makeFunctionReference<"mutation">("app:rejectDraft"),
    listApprovedDrills: makeFunctionReference<"query">("app:listApprovedDrills")
  }
};
