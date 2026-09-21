import type { AiAnalysisResult } from "./messages";

export function rejectDraft(result: AiAnalysisResult, fieldKey: AiAnalysisResult["drafts"][number]["fieldKey"]): AiAnalysisResult {
  return { ...result, drafts: result.drafts.filter((draft) => draft.fieldKey !== fieldKey) };
}

export function draftOverridesFromResult(result: AiAnalysisResult): Record<string, string> {
  return Object.fromEntries(result.drafts.map((draft) => [draft.fieldKey, draft.content]));
}
