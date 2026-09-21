/** 填写失败报告只保留站点、字段标识和失败原因，绝不写入字段值。 */
export type FailureReport = {
  siteId: string;
  host: string;
  failedFields: string[];
  reasons: Record<string, string>;
  createdAt: string;
};

export function buildFailureReport(siteId: string, pageUrl: string, failedFields: string[], reasons: Record<string, string>, now = new Date().toISOString()): FailureReport {
  let host = "未知页面";
  try {
    host = new URL(pageUrl).host;
  } catch {
    // 页面地址无效时只保留固定文案，不把原始地址写入报告。
  }
  return { siteId, host, failedFields: [...failedFields], reasons: { ...reasons }, createdAt: now };
}

export function stringifyFailureReport(report: FailureReport) {
  return JSON.stringify(report, null, 2);
}
