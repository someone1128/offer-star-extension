import { describe, expect, it } from "vitest";
import { draftOverridesFromResult, rejectDraft } from "../src/shared/draft-state";

describe("AI 草稿状态", () => {
  it("拒绝单条草稿时不影响其他草稿", () => {
    const result = { mappings: [], drafts: [
      { fieldKey: "description" as const, content: "自我介绍", reason: "" },
      { fieldKey: "position" as const, content: "产品经理", reason: "" }
    ] };
    expect(rejectDraft(result, "description").drafts.map((draft) => draft.fieldKey)).toEqual(["position"]);
    expect(draftOverridesFromResult(result)).toEqual({ description: "自我介绍", position: "产品经理" });
  });
});
