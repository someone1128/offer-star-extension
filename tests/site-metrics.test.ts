import { describe, expect, it } from "vitest";
import { formatSiteMetric, recordSiteFillMetric, siteMetricSuccessRate } from "../src/shared/site-metrics";

describe("站点填写质量统计", () => {
  it("累计填写成功和失败数量且不保存业务内容", () => {
    const first = recordSiteFillMetric({}, "moka-ats", 8, 2, "2026-09-21T00:00:00.000Z");
    const second = recordSiteFillMetric(first, "moka-ats", 3, 1, "2026-09-21T01:00:00.000Z");
    expect(second["moka-ats"]).toEqual({ attempts: 2, filled: 11, failed: 3, updatedAt: "2026-09-21T01:00:00.000Z" });
    expect(JSON.stringify(second)).not.toContain("手机号");
  });

  it("没有可统计字段时成功率为零，避免除零异常", () => {
    expect(siteMetricSuccessRate(undefined)).toBe(0);
    expect(siteMetricSuccessRate({ attempts: 1, filled: 0, failed: 0, updatedAt: "" })).toBe(0);
    expect(siteMetricSuccessRate({ attempts: 1, filled: 9, failed: 1, updatedAt: "" })).toBe(0.9);
  });

  it("格式化开发诊断文案，不泄露字段值", () => {
    expect(formatSiteMetric({ attempts: 2, filled: 11, failed: 3, updatedAt: "" })).toBe("累计成功率 79%，成功 11 个，失败 3 个");
    expect(formatSiteMetric(undefined)).toBe("暂无填写统计");
  });
});
