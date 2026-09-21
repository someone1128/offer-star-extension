import { describe, expect, it } from "vitest";
import { clearResumeSessionState, shouldClearExtensionToken } from "../src/shared/auth-session";

describe("扩展登录状态交互契约", () => {
  it("清除登录后不应继续保留简历选择状态", () => {
    const state = { resumes: [{ id: "r1" }], selectedResumeId: "r1", resume: { basic: { name: "测试" } } };
    const cleared = clearResumeSessionState();
    expect(cleared.resumes).toHaveLength(0);
    expect(cleared.selectedResumeId).toBe("");
    expect(cleared.resume).toBeNull();
    expect(state.selectedResumeId).toBe("r1");
  });

  it("只有 401 未授权响应会触发登录状态清理", () => {
    expect(shouldClearExtensionToken(401)).toBe(true);
    expect(shouldClearExtensionToken(403)).toBe(false);
    expect(shouldClearExtensionToken(500)).toBe(false);
  });
});
