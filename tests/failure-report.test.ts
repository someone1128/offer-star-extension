import { describe, expect, it } from "vitest";
import { buildFailureReport, stringifyFailureReport } from "../src/shared/failure-report";

describe("填写失败诊断报告", () => {
  it("只保存站点主机、字段标识和原因，不保存完整地址或字段值", () => {
    const report = buildFailureReport("moka-ats", "https://app.mokahr.com/apply/example?phone=13800000000", ["phone"], { phone: "没有找到对应页面控件" }, "2026-09-21T00:00:00.000Z");
    expect(report).toEqual({ siteId: "moka-ats", host: "app.mokahr.com", failedFields: ["phone"], reasons: { phone: "没有找到对应页面控件" }, createdAt: "2026-09-21T00:00:00.000Z" });
    expect(stringifyFailureReport(report)).not.toContain("13800000000");
  });

  it("无效地址使用固定安全文案", () => {
    expect(buildFailureReport("generic", "invalid-url", ["email"], {}).host).toBe("未知页面");
  });
});
