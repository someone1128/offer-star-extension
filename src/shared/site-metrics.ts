/** 站点填写质量统计，只保存数量，不保存职位、简历或用户隐私内容。 */
export type SiteMetric = { attempts: number; filled: number; failed: number; updatedAt: string };
export type SiteMetrics = Record<string, SiteMetric>;

export function recordSiteFillMetric(metrics: SiteMetrics, siteId: string, filled: number, failed: number, now = new Date().toISOString()): SiteMetrics {
  const current = metrics[siteId] ?? { attempts: 0, filled: 0, failed: 0, updatedAt: now };
  return {
    ...metrics,
    [siteId]: {
      attempts: current.attempts + 1,
      filled: current.filled + Math.max(0, filled),
      failed: current.failed + Math.max(0, failed),
      updatedAt: now
    }
  };
}

export function siteMetricSuccessRate(metric: SiteMetric | undefined) {
  if (!metric || metric.filled + metric.failed === 0) return 0;
  return metric.filled / (metric.filled + metric.failed);
}

export function formatSiteMetric(metric: SiteMetric | undefined) {
  if (!metric || metric.filled + metric.failed === 0) return "暂无填写统计";
  return `累计成功率 ${Math.round(siteMetricSuccessRate(metric) * 100)}%，成功 ${metric.filled} 个，失败 ${metric.failed} 个`;
}
