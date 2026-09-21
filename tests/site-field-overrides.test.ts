import { describe, expect, it } from "vitest";
import { applySavedFieldOverrides, normalizeFieldLabel, saveFieldOverride, type SiteFieldOverrides } from "../src/shared/site-field-overrides";
import type { DetectedField } from "../src/shared/messages";

const field = (id: string, label: string, key: DetectedField["key"] = null, confidence = 0): DetectedField => ({ id, label, key, confidence, type: "text", elementIndex: 0 });

describe("站点字段映射记忆", () => {
  it("标题规范化会忽略空格、冒号和必填符号", () => {
    expect(normalizeFieldLabel("  联系电话：* ")).toBe("联系电话");
  });

  it("可以保存用户确认并在下一次扫描复用", () => {
    const saved = saveFieldOverride({}, "generic", "联系电话", "phone");
    const result = applySavedFieldOverrides([field("1", "联系电话")], "generic", saved);
    expect(result[0]).toMatchObject({ key: "phone", confidence: 1 });
  });

  it("不会覆盖已有高置信度识别结果", () => {
    const overrides: SiteFieldOverrides = { generic: { 姓名: "phone" } };
    const result = applySavedFieldOverrides([field("1", "姓名", "name", 0.86)], "generic", overrides);
    expect(result[0].key).toBe("name");
  });

  it("确认清空时删除旧映射", () => {
    const saved = saveFieldOverride({ generic: { 联系电话: "phone" } }, "generic", "联系电话", null);
    expect(saved.generic).toEqual({});
  });
});
