import { describe, expect, it } from "vitest";
import { buildFillPreview } from "../src/shared/fill-preview";

describe("填写前预览", () => {
  it("只预览高置信度且有值的普通字段", () => {
    const preview = buildFillPreview([
      { id: "name", key: "name", label: "姓名", type: "input", elementIndex: 0, confidence: 0.86 },
      { id: "phone", key: "phone", label: "手机号", type: "input", elementIndex: 1, confidence: 0.5 },
      { id: "photo", key: "photo", label: "证件照", type: "input", elementIndex: 2, confidence: 0.86 },
      { id: "empty", key: "email", label: "邮箱", type: "input", elementIndex: 3, confidence: 0.86 }
    ], { name: "测试用户", phone: "13800000000", photo: "ignored", email: "" });
    expect(preview).toEqual([{ fieldId: "name", label: "姓名", key: "name", value: "测试用户" }]);
  });

  it("重复字段的数组值会在预览中保留顺序", () => {
    const preview = buildFillPreview([
      { id: "company-1", key: "company", label: "公司", type: "input", elementIndex: 0, confidence: 1 },
      { id: "company-2", key: "company", label: "公司", type: "input", elementIndex: 1, confidence: 1 }
    ], { company: ["甲公司", "乙公司"] });
    expect(preview.map((item) => item.value)).toEqual(["甲公司", "乙公司"]);
  });
});
