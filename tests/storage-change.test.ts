import { describe, expect, it } from "vitest";
import { hasExtensionTokenChange } from "../src/shared/storage-change";

describe("扩展登录状态存储变化", () => {
  it("登录和退出登录都需要刷新悬浮面板", () => {
    expect(hasExtensionTokenChange({ extensionToken: { newValue: "token" } }, "local")).toBe(true);
    expect(hasExtensionTokenChange({ extensionToken: { oldValue: "token" } }, "local")).toBe(true);
  });

  it("其他存储区域和无关 key 不触发刷新", () => {
    expect(hasExtensionTokenChange({ extensionToken: { newValue: "token" } }, "sync")).toBe(false);
    expect(hasExtensionTokenChange({ selectedResumeId: { newValue: "resume" } }, "local")).toBe(false);
  });
});
