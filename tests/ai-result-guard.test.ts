import { describe, expect, it } from "vitest";
import { canApplyAiResult } from "../src/shared/ai-result-guard";

const base = {
  requestId: 1,
  activeRequestId: 1,
  requestRevision: 3,
  currentRevision: 3,
  requestedTabId: 10,
  currentTabId: 10,
  requestedUrl: "https://example.com/apply/1",
  currentUrl: "https://example.com/apply/1"
};

describe("AI 结果页面状态保护", () => {
  it("同一请求、同一标签页和同一页面可以应用结果", () => {
    expect(canApplyAiResult(base)).toBe(true);
  });

  it.each([
    ["重复请求已更新", { activeRequestId: 2 }],
    ["页面上下文已更新", { currentRevision: 4 }],
    ["标签页已切换", { currentTabId: 11 }],
    ["页面地址已变化", { currentUrl: "https://example.com/apply/2" }]
  ])("%s 时拒绝旧 AI 结果", (_name, change) => {
    expect(canApplyAiResult({ ...base, ...change })).toBe(false);
  });

  it("缺少当前标签页信息时拒绝应用结果", () => {
    expect(canApplyAiResult({ ...base, currentTabId: undefined })).toBe(false);
  });
});
