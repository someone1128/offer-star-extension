import { describe, expect, it } from "vitest";
import { validateFieldValue } from "../src/shared/field-value-validation";

describe("表单值严格校验", () => {
  it("拒绝明显错误的邮箱和手机号", () => {
    expect(validateFieldValue("email", "not-an-email")).toBe("邮箱格式不合法");
    expect(validateFieldValue("phone", "123")).toBe("手机号或电话格式不合法");
  });

  it("接受常见中国手机号、座机和邮箱", () => {
    expect(validateFieldValue("email", "user@example.com")).toBeNull();
    expect(validateFieldValue("phone", "13800000000")).toBeNull();
    expect(validateFieldValue("phone", "010-12345678")).toBeNull();
  });

  it("限制年龄范围", () => {
    expect(validateFieldValue("age", "13")).toBe("年龄应为 14 到 100 的整数");
    expect(validateFieldValue("age", "28")).toBeNull();
  });

  it("接受中文日期和在职状态，拒绝随机文本", () => {
    expect(validateFieldValue("startDate", "2020年1月")).toBeNull();
    expect(validateFieldValue("endDate", "至今")).toBeNull();
    expect(validateFieldValue("endDate", "日期待定")).toBe("日期格式不合法");
  });

  it("业务文本字段不做过度限制", () => {
    expect(validateFieldValue("description", "邮箱格式不标准的说明文字")).toBeNull();
  });
});
