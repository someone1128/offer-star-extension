import { describe, expect, it } from "vitest";
import { canQuickFill } from "../src/shared/quick-fill";
import type { DetectedField } from "../src/shared/messages";

const field = (key: DetectedField["key"], confidence = 0.86, label = "字段"): DetectedField => ({ id: label, key, confidence, label, type: "text", elementIndex: 0 });

describe("一键填写安全门槛", () => {
  it("普通高置信度字段允许一键填写", () => {
    expect(canQuickFill([field("name"), field("email")], false)).toBe(true);
  });

  it("低置信度、附件和敏感问题禁止一键填写", () => {
    expect(canQuickFill([field("name"), field("email", 0.5)], false)).toBe(false);
    expect(canQuickFill([field("attachment")], false)).toBe(false);
    expect(canQuickFill([field(null, 0, "身份证号码")], false)).toBe(false);
  });

  it("页面过期或没有字段时禁止一键填写", () => {
    expect(canQuickFill([], false)).toBe(false);
    expect(canQuickFill([field("name")], true)).toBe(false);
  });
});
